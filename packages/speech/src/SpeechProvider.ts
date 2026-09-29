/**
 * SpeechProvider Abstraction Interface for HRKVoice
 */

import { SpeechProviderType } from '@hrkvoice/shared';

export interface TranscribeOptions {
  language?: string; // Language code or 'auto'
  promptBiasing?: string[]; // Vocabulary / dictionary biasing
  temperature?: number;
  onPartialTranscript?: (partial: string) => void;
  mimeType?: string;
}

export interface TranscriptionResponse {
  transcript: string;
  detectedLanguage?: string;
  confidence?: number;
  durationSeconds?: number;
  provider: SpeechProviderType;
  model: string;
  isStreaming?: boolean;
}

export interface SpeechProvider {
  readonly id: SpeechProviderType;
  readonly displayName: string;
  readonly isLocal: boolean;

  /**
   * Check if this provider has credentials configured and reachable
   */
  isConfigured(): boolean;

  /**
   * Check if a specific language code is supported
   */
  supportsLanguage(languageCode: string): boolean;

  /**
   * Transcribe an audio buffer (WAV, WebM, OGG, etc.)
   */
  transcribe(
    audioData: Buffer | Uint8Array,
    options?: TranscribeOptions
  ): Promise<TranscriptionResponse>;

  /**
   * Health check / validation
   */
  testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }>;
}
