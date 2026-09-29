/**
 * Groq Whisper Speech Provider for HRKVoice
 * High-speed, low-latency multilingual speech recognition (whisper-large-v3)
 */

import { SpeechProvider, TranscribeOptions, TranscriptionResponse } from '../SpeechProvider';
import { SpeechProviderType, INDIAN_LANGUAGE_REGISTRY } from '@hrkvoice/shared';

export class GroqSpeechProvider implements SpeechProvider {
  public readonly id: SpeechProviderType = 'groq';
  public readonly displayName = 'Groq Whisper (Ultra Fast)';
  public readonly isLocal = false;

  private apiKey: string;
  private model: string;

  constructor(apiKey = '', model = 'whisper-large-v3') {
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
    return Boolean(lang?.speechProviderCodes.groq);
  }

  public async transcribe(
    audioData: Buffer | Uint8Array,
    options?: TranscribeOptions
  ): Promise<TranscriptionResponse> {
    if (!this.isConfigured()) {
      throw new Error('Groq Speech Provider requires an API key. Please configure GROQ_API_KEY in Settings.');
    }

    const startTime = Date.now();
    const formData = new FormData();

    // Inspect magic bytes to detect WebM, OGG, WAV, MP4, MP3
    const bytes = new Uint8Array(audioData);
    let detectedMime = options?.mimeType;
    let fileName = 'audio.webm';

    if (bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) {
      detectedMime = 'audio/webm';
      fileName = 'audio.webm';
    } else if (bytes[0] === 0x4F && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53) {
      detectedMime = 'audio/ogg';
      fileName = 'audio.ogg';
    } else if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
      detectedMime = 'audio/wav';
      fileName = 'audio.wav';
    } else if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
      detectedMime = 'audio/mp4';
      fileName = 'audio.mp4';
    } else if ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) || (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0)) {
      detectedMime = 'audio/mpeg';
      fileName = 'audio.mp3';
    } else {
      detectedMime = detectedMime || 'audio/webm';
      fileName = detectedMime.includes('wav') ? 'audio.wav' : 'audio.webm';
    }

    const audioBlob = new Blob([bytes], { type: detectedMime });
    formData.append('file', audioBlob, fileName);
    formData.append('model', this.model);

    // Language specification (handles 'gu-IN' -> 'gu')
    let langCode = options?.language;
    if (langCode && langCode !== 'auto') {
      const lower = langCode.toLowerCase().split('-')[0];
      const langDef = INDIAN_LANGUAGE_REGISTRY[lower] || INDIAN_LANGUAGE_REGISTRY[langCode.toLowerCase()];
      const code = langDef?.speechProviderCodes.groq || lower;
      formData.append('language', code);
    }

    // Vocabulary Biasing & Language Prior Prompts to guarantee native script output
    const LANGUAGE_PROMPTS: Record<string, string> = {
      gu: 'આ એક સ્પષ્ટ ગુજરાતી ડિક્ટેશન છે. યોગ્ય વિરામચિહ્નો સાથે શુદ્ધ ગુજરાતી લિપિમાં લખો.',
      hi: 'यह एक स्पष्ट हिंदी डिक्टेशन है। उचित विराम चिह्नों के साथ शुद्ध देवनागरी लिपि में लिखें।',
      mr: 'हे एक स्पष्ट मराठी डिक्टेशन आहे. योग्य विरामचिन्हांसह शुद्ध मराठीत लिहा.',
      bn: 'এটি একটি স্পষ্ট বাংলা ডিক্টেশন। সঠিক বিরামচিহ্ন সহ বিশুদ্ধ বাংলায় লিখুন।',
      ta: 'இது ஒரு தெளிவான தமிழ் பதிவு. சரியான நிறுத்தற்குறிகளுடன் தூய தமிழில் எழுதுங்கள்.',
      te: 'ఇది స్పష్టమైన తెలుగు డిక్టేషన్. సరైన విరామ చిహ్నాలతో స్వచ్ఛమైన తెలుగులో రాయండి.'
    };

    const prompts: string[] = [];
    if (langCode) {
      const codeKey = langCode.toLowerCase().split('-')[0];
      if (LANGUAGE_PROMPTS[codeKey]) {
        prompts.push(LANGUAGE_PROMPTS[codeKey]);
      }
    }
    if (options?.promptBiasing && options.promptBiasing.length > 0) {
      prompts.push(options.promptBiasing.join(', '));
    }
    if (prompts.length > 0) {
      formData.append('prompt', prompts.join('. '));
    }

    formData.append('response_format', 'json');

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 401) {
        throw new Error('Invalid Groq API key. Check your credentials in HRKVoice settings.');
      }
      if (response.status === 429) {
        throw new Error('Groq rate limit reached. Please wait a moment or check your account quota.');
      }
      throw new Error(`Groq Speech error (${response.status}): ${errText}`);
    }

    const result = await response.json();
    const duration = (Date.now() - startTime) / 1000;

    return {
      transcript: result.text || '',
      detectedLanguage: options?.language,
      confidence: 0.95,
      durationSeconds: duration,
      provider: 'groq',
      model: this.model
    };
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    if (!this.isConfigured()) {
      return { success: false, message: 'API key is missing.' };
    }
    const start = Date.now();
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` }
      });
      if (res.ok) {
        return {
          success: true,
          message: 'Connected to Groq Speech Cloud successfully.',
          latencyMs: Date.now() - start
        };
      }
      return { success: false, message: `Connection failed with status ${res.status}` };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error reaching Groq.' };
    }
  }
}
