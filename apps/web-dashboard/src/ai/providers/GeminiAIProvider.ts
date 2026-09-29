/**
 * Google Gemini AI Provider for HRKVoice (Gemini 2.0 Flash)
 */

import { AIProvider, AIProcessOptions } from '../AIProvider';
import { AIProviderType, ProcessingResult } from '@hrkvoice/shared';
import { GENERAL_MODE_PROMPT, EMAIL_MODE_PROMPT, CHAT_MODE_PROMPT, DEVELOPER_MODE_PROMPT, AI_PROMPT_MODE_PROMPT, NOTES_MODE_PROMPT } from '../prompts';
import { TextProcessingPipeline } from '../pipeline/TextProcessingPipeline';

export class GeminiAIProvider implements AIProvider {
  public readonly id: AIProviderType = 'gemini';
  public readonly displayName = 'Google Gemini 2.0 Flash';
  public readonly isLocal = false;

  private apiKey: string;
  private model: string;

  constructor(apiKey = '', model = 'gemini-2.0-flash') {
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
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: JSON.stringify(userPayload) }]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.1
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API error ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(rawText);

      return {
        rawTranscript,
        finalText: parsed.finalText || rawTranscript,
        detectedLanguage: parsed.detectedLanguage || options?.sourceLanguage || 'en',
        confidence: parsed.confidence || 0.97,
        durationMs: Date.now() - startTime,
        wordsCount: (parsed.finalText || '').split(/\s+/).length,
        detectedMode: options?.mode || 'general',
        warnings: parsed.warnings,
        appliedTransformations: {
          fillersRemoved: 1,
          selfCorrectionsApplied: 1,
          dictionaryReplacements: 0,
          snippetsExpanded: 0,
          formattingApplied: ['gemini-ai-cleanup'],
          technicalTermsPreserved: []
        }
      };
    } catch (err: any) {
      console.warn('[GeminiAIProvider] Error calling Gemini, using local pipeline:', err.message);
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
      const prompt = `Rewrite this text with instruction "${instruction}". Keep the original language and script. Return only the revised text.\n\n${text}`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 }
          })
        }
      );
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;
    } catch {
      return text;
    }
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.isConfigured()) return { success: false, message: 'Gemini API key is not configured.' };
    const start = Date.now();
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}?key=${this.apiKey}`
      );
      if (res.ok) {
        return {
          success: true,
          message: 'Gemini API connected successfully.',
          latencyMs: Date.now() - start
        };
      }
      return { success: false, message: `Status code ${res.status}` };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}
