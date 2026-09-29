/**
 * OpenAI AI Provider for HRKVoice (GPT-4o / GPT-4o-mini)
 */

import { AIProvider, AIProcessOptions } from '../AIProvider';
import { AIProviderType, ProcessingResult } from '@hrkvoice/shared';
import { GENERAL_MODE_PROMPT, EMAIL_MODE_PROMPT, CHAT_MODE_PROMPT, DEVELOPER_MODE_PROMPT, AI_PROMPT_MODE_PROMPT, NOTES_MODE_PROMPT } from '../prompts';
import { TextProcessingPipeline } from '../pipeline/TextProcessingPipeline';

export class OpenAIAIProvider implements AIProvider {
  public readonly id: AIProviderType = 'openai';
  public readonly displayName = 'OpenAI GPT-4o-mini';
  public readonly isLocal = false;

  private apiKey: string;
  private model: string;

  constructor(apiKey = '', model = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.model = model;
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  private getSystemPromptForMode(mode = 'general'): string {
    switch (mode) {
      case 'email': return EMAIL_MODE_PROMPT;
      case 'chat': return CHAT_MODE_PROMPT;
      case 'developer': return DEVELOPER_MODE_PROMPT;
      case 'prompt': return AI_PROMPT_MODE_PROMPT;
      case 'notes': return NOTES_MODE_PROMPT;
      default: return GENERAL_MODE_PROMPT;
    }
  }

  public async processTranscript(
    rawTranscript: string,
    options?: AIProcessOptions
  ): Promise<ProcessingResult> {
    if (!this.isConfigured()) {
      return TextProcessingPipeline.execute(rawTranscript, options);
    }

    const startTime = Date.now();
    const systemPrompt = this.getSystemPromptForMode(options?.mode);

    const userPayload = {
      transcript: rawTranscript,
      sourceLanguage: options?.sourceLanguage || 'auto',
      targetLanguage: options?.targetLanguage || 'same_as_spoken',
      mode: options?.mode || 'general',
      context: options?.context,
      userDictionary: options?.userDictionary?.map(d => `${d.word} -> ${d.preferredSpelling}`),
      snippets: options?.snippets?.map(s => `${s.trigger} => ${s.content}`)
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: JSON.stringify(userPayload) }
          ],
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      const parsed = JSON.parse(content);

      return {
        rawTranscript,
        finalText: parsed.finalText || rawTranscript,
        detectedLanguage: parsed.detectedLanguage || options?.sourceLanguage || 'en',
        confidence: parsed.confidence || 0.96,
        durationMs: Date.now() - startTime,
        wordsCount: (parsed.finalText || '').split(/\s+/).length,
        detectedMode: options?.mode || 'general',
        warnings: parsed.warnings,
        appliedTransformations: {
          fillersRemoved: 1,
          selfCorrectionsApplied: 1,
          dictionaryReplacements: 0,
          snippetsExpanded: 0,
          formattingApplied: ['openai-ai-cleanup'],
          technicalTermsPreserved: []
        }
      };
    } catch (err: any) {
      console.warn('[OpenAIAIProvider] Cloud call failed, falling back to local pipeline:', err.message);
      return TextProcessingPipeline.execute(rawTranscript, options);
    }
  }

  public async rewriteText(
    text: string,
    instruction: 'shorten' | 'expand' | 'professional' | 'casual' | 'bullets' | 'fix-grammar' | string,
    language?: string
  ): Promise<string> {
    if (!this.isConfigured()) {
      return TextProcessingPipeline.execute(text).finalText;
    }
    try {
      const prompt = `Rewrite the following text with instruction: "${instruction}". Keep the original language and script. Return only the rewritten text.\n\nText:\n${text}`;
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.2
        })
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content?.trim() || text;
    } catch {
      return text;
    }
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.isConfigured()) return { success: false, message: 'OpenAI API key is missing.' };
    const start = Date.now();
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      if (res.ok) {
        return {
          success: true,
          message: 'OpenAI connected successfully.',
          latencyMs: Date.now() - start
        };
      }
      return { success: false, message: `OpenAI returned status ${res.status}` };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}
