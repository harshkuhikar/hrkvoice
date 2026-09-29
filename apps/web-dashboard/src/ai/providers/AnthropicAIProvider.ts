/**
 * Anthropic AI Provider for HRKVoice (Claude 3.5 Haiku / Sonnet)
 */

import { AIProvider, AIProcessOptions } from '../AIProvider';
import { AIProviderType, ProcessingResult } from '@hrkvoice/shared';
import { GENERAL_MODE_PROMPT, EMAIL_MODE_PROMPT, CHAT_MODE_PROMPT, DEVELOPER_MODE_PROMPT, AI_PROMPT_MODE_PROMPT, NOTES_MODE_PROMPT } from '../prompts';
import { TextProcessingPipeline } from '../pipeline/TextProcessingPipeline';

export class AnthropicAIProvider implements AIProvider {
  public readonly id: AIProviderType = 'anthropic';
  public readonly displayName = 'Anthropic Claude 3.5';
  public readonly isLocal = false;

  private apiKey: string;
  private model: string;

  constructor(apiKey = '', model = 'claude-3-5-haiku-20241022') {
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
    const systemPrompt = `${this.getSystemPromptForMode(options?.mode)}\nIMPORTANT: Output ONLY a single raw JSON object, without markdown blocks.`;

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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          system: systemPrompt,
          messages: [{ role: 'user', content: JSON.stringify(userPayload) }],
          max_tokens: 1024,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API returned status ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.content?.[0]?.text || '{}';
      // Clean possible markdown code fences if model returned them
      const cleanedJson = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
      const parsed = JSON.parse(cleanedJson);

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
          formattingApplied: ['claude-ai-cleanup'],
          technicalTermsPreserved: []
        }
      };
    } catch (err: any) {
      console.warn('[AnthropicAIProvider] Error calling Claude, falling back to local pipeline:', err.message);
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
      const prompt = `Rewrite this text with instruction "${instruction}". Keep the original language. Output only the rewritten text.\n\n${text}`;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 512,
          temperature: 0.2
        })
      });
      const data = await res.json();
      return data.content?.[0]?.text?.trim() || text;
    } catch {
      return text;
    }
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.isConfigured()) return { success: false, message: 'Anthropic API key is not configured.' };
    const start = Date.now();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 5
        })
      });
      if (res.ok) {
        return {
          success: true,
          message: 'Anthropic Claude connected successfully.',
          latencyMs: Date.now() - start
        };
      }
      return { success: false, message: `Status code ${res.status}` };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}
