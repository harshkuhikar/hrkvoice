/**
 * OpenAI Speech Provider for HRKVoice (whisper-1)
 */

import { SpeechProvider, TranscribeOptions, TranscriptionResponse } from '../SpeechProvider';
import { SpeechProviderType, INDIAN_LANGUAGE_REGISTRY } from '@hrkvoice/shared';

export class OpenAISpeechProvider implements SpeechProvider {
  public readonly id: SpeechProviderType = 'openai';
  public readonly displayName = 'OpenAI Whisper';
  public readonly isLocal = false;

  private apiKey: string;
  private model: string;

  constructor(apiKey = '', model = 'whisper-1') {
    this.apiKey = apiKey;
    this.model = model;
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 0);
  }

  public supportsLanguage(languageCode: string): boolean {
    if (!languageCode || languageCode === 'auto') return true;
    const lang = INDIAN_LANGUAGE_REGISTRY[languageCode.toLowerCase()];
    return Boolean(lang?.speechProviderCodes.openai);
  }

  public async transcribe(
    audioData: Buffer | Uint8Array,
    options?: TranscribeOptions
  ): Promise<TranscriptionResponse> {
    if (!this.isConfigured()) {
      throw new Error('OpenAI Speech Provider requires an API key. Please configure OPENAI_API_KEY in Settings.');
    }

    const startTime = Date.now();
    const formData = new FormData();

    const mimeType = options?.mimeType || 'audio/wav';
    const audioBlob = new Blob([new Uint8Array(audioData)], { type: mimeType });
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', this.model);

    if (options?.language && options.language !== 'auto') {
      const langDef = INDIAN_LANGUAGE_REGISTRY[options.language.toLowerCase()];
      const code = langDef?.speechProviderCodes.openai || options.language;
      formData.append('language', code);
    }

    if (options?.promptBiasing && options.promptBiasing.length > 0) {
      formData.append('prompt', options.promptBiasing.join(', '));
    }

    formData.append('response_format', 'verbose_json');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401) {
        throw new Error('Invalid OpenAI API key. Check your credentials in HRKVoice settings.');
      }
      if (response.status === 429) {
        throw new Error('OpenAI quota or rate limit exceeded. Please check your account usage.');
      }
      throw new Error(`OpenAI Speech error (${response.status}): ${errText}`);
    }

    const result = await response.json();
    const duration = (Date.now() - startTime) / 1000;

    return {
      transcript: result.text || '',
      detectedLanguage: result.language || options?.language,
      confidence: 0.94,
      durationSeconds: duration,
      provider: 'openai',
      model: this.model
    };
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.isConfigured()) {
      return { success: false, message: 'OpenAI API key is missing.' };
    }
    const start = Date.now();
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      if (res.ok) {
        return {
          success: true,
          message: 'Connected to OpenAI Speech API successfully.',
          latencyMs: Date.now() - start
        };
      }
      return { success: false, message: `Connection failed with status ${res.status}` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error reaching OpenAI.' };
    }
  }
}
