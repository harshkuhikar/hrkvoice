/**
 * Google Cloud Speech-to-Text Provider for HRKVoice
 */

import { SpeechProvider, TranscribeOptions, TranscriptionResponse } from '../SpeechProvider';
import { SpeechProviderType, INDIAN_LANGUAGE_REGISTRY } from '@hrkvoice/shared';

export class GoogleSpeechProvider implements SpeechProvider {
  public readonly id: SpeechProviderType = 'google';
  public readonly displayName = 'Google Cloud Speech';
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
    return Boolean(lang?.speechProviderCodes.google);
  }

  public async transcribe(
    audioData: Buffer | Uint8Array,
    options?: TranscribeOptions
  ): Promise<TranscriptionResponse> {
    if (!this.isConfigured()) {
      throw new Error('Google Speech Provider requires an API key. Please configure GOOGLE_SPEECH_API_KEY in Settings.');
    }

    const startTime = Date.now();
    let langCode = 'hi-IN';
    if (options?.language && options.language !== 'auto') {
      const langDef = INDIAN_LANGUAGE_REGISTRY[options.language.toLowerCase()];
      langCode = langDef?.speechProviderCodes.google || 'hi-IN';
    }

    const base64Audio = Buffer.from(audioData).toString('base64');

    const requestBody = {
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: langCode,
        enableAutomaticPunctuation: true,
        speechContexts: options?.promptBiasing
          ? [{ phrases: options.promptBiasing }]
          : []
      },
      audio: {
        content: base64Audio
      }
    };

    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Google Speech error (${response.status}): ${err}`);
    }

    const result = await response.json();
    const transcript =
      result.results?.map((r: any) => r.alternatives?.[0]?.transcript).join(' ') || '';
    const confidence =
      result.results?.[0]?.alternatives?.[0]?.confidence || 0.93;
    const duration = (Date.now() - startTime) / 1000;

    return {
      transcript,
      detectedLanguage: langCode,
      confidence,
      durationSeconds: duration,
      provider: 'google',
      model: 'google-v1'
    };
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.isConfigured()) {
      return { success: false, message: 'Google Speech API key is missing.' };
    }
    const start = Date.now();
    try {
      const res = await fetch(`https://speech.googleapis.com/v1/operations?key=${this.apiKey}`);
      if (res.ok || res.status === 404 || res.status === 400) {
        return {
          success: true,
          message: 'Google Cloud Speech API is reachable.',
          latencyMs: Date.now() - start
        };
      }
      return { success: false, message: `Status code ${res.status}` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error reaching Google Speech.' };
    }
  }
}
