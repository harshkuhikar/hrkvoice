/**
 * AI Provider Abstraction Interface for HRKVoice
 */

import {
  AIProviderType,
  ContextInfo,
  DictionaryEntry,
  ProcessingResult,
  Snippet,
  WritingMode
} from '@hrkvoice/shared';

export interface AIProcessOptions {
  sourceLanguage?: string;
  targetLanguage?: string;
  mode?: WritingMode;
  context?: ContextInfo;
  userDictionary?: DictionaryEntry[];
  snippets?: Snippet[];
  enableFillerRemoval?: boolean;
  enableSelfCorrection?: boolean;
  enableFormatting?: boolean;
  preserveCodeSwitching?: boolean;
}

export interface AIProvider {
  readonly id: AIProviderType;
  readonly displayName: string;
  readonly isLocal: boolean;

  isConfigured(): boolean;

  processTranscript(
    rawTranscript: string,
    options?: AIProcessOptions
  ): Promise<ProcessingResult>;

  rewriteText(
    text: string,
    instruction: 'shorten' | 'expand' | 'professional' | 'casual' | 'bullets' | 'fix-grammar' | string,
    language?: string
  ): Promise<string>;

  testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }>;
}
