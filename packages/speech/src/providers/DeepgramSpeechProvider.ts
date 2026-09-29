/**
 * Deepgram Speech Provider for HRKVoice (nova-2)
 */

import { SpeechProvider, TranscribeOptions, TranscriptionResponse } from '../SpeechProvider';
import { SpeechProviderType, INDIAN_LANGUAGE_REGISTRY } from '@hrkvoice/shared';

export class DeepgramSpeechProvider implements SpeechProvider {
  public readonly id: SpeechProviderType = 'deepgram';
  public readonly displayName = 'Deepgram Nova-2';
  public readonly isLocal = false;

  private apiKey: string;

  constructor(apiKey = '') {
    this.apiKey = apiKey;
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
    return Boolean(lang?.speechProviderCodes.deepgram);
  }

  public async transcribe(
    audioData: Buffer | Uint8Array,
    options?: TranscribeOptions
  ): Promise<TranscriptionResponse> {
    if (!this.isConfigured()) {
      throw new Error('Deepgram Speech Provider requires an API key. Please configure DEEPGRAM_API_KEY in Settings.');
    }

    const startTime = Date.now();
    const mimeType = options?.mimeType || 'audio/wav';

    let langParam = 'en';
    if (options?.language && options.language !== 'auto') {
      const langDef = INDIAN_LANGUAGE_REGISTRY[options.language.toLowerCase()];
      langParam = langDef?.speechProviderCodes.deepgram || options.language;
    }

    const url = new URL('https://api.deepgram.com/v1/listen');
    url.searchParams.set('model', 'nova-2');
    url.searchParams.set('smart_format', 'true');
    url.searchParams.set('language', langParam);
    if (options?.promptBiasing && options.promptBiasing.length > 0) {
      options.promptBiasing.forEach(kw => url.searchParams.append('keywords', kw));
    }

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.apiKey}`,
        'Content-Type': mimeType
      },
      body: new Uint8Array(audioData)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Deepgram error (${response.status}): ${err}`);
    }

    const result = await response.json();
    const transcript =
      result.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';
    const confidence =
      result.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0.92;
    const duration = (Date.now() - startTime) / 1000;

    return {
      transcript,
      detectedLanguage: langParam,
      confidence,
      durationSeconds: duration,
      provider: 'deepgram',
      model: 'nova-2'
    };
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Deepgram API key is missing.' };
    }
    const start = Date.now();
    try {
      const res = await fetch('https://api.deepgram.com/v1/projects', {
        headers: { Authorization: `Token ${this.apiKey}` }
      });
      if (res.ok) {
        return {
          success: true,
          message: 'Connected to Deepgram successfully.',
          latencyMs: Date.now() - start
        };
      }
      return { success: false, message: `Deepgram connection failed (${res.status})` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error reaching Deepgram.' };
    }
  }
}
