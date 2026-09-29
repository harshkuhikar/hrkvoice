/**
 * Core Type Definitions for HRKVoice Platform
 */

export type WritingMode =
  | 'general'
  | 'email'
  | 'chat'
  | 'professional'
  | 'casual'
  | 'developer'
  | 'prompt'
  | 'notes';

export type OutputLanguageOption =
  | 'same_as_spoken'
  | 'en'
  | 'hi'
  | 'gu'
  | 'bn'
  | 'ta'
  | 'te'
  | 'mr'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'or'
  | 'as'
  | 'ur';

export type SpeechProviderType =
  | 'groq'
  | 'openai'
  | 'deepgram'
  | 'google'
  | 'mock'
  | 'local';

export type AIProviderType =
  | 'groq'
  | 'openai'
  | 'gemini'
  | 'anthropic'
  | 'mock';

export type DictionaryCategory =
  | 'personal'
  | 'work'
  | 'developer'
  | 'company'
  | 'medical'
  | 'legal'
  | 'custom';

export interface DictionaryEntry {
  id: string;
  word: string;
  pronunciation?: string;
  preferredSpelling: string;
  language: string; // language code or 'all'
  category: DictionaryCategory;
  enabled: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Snippet {
  id: string;
  trigger: string;
  title: string;
  content: string;
  category: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptionHistoryItem {
  id: string;
  timestamp: string;
  durationMs: number;
  rawTranscript: string;
  processedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  mode: WritingMode;
  activeApp?: string;
  activeWindowTitle?: string;
  confidence: number;
  audioRetained: boolean;
  wordsCount: number;
}

export interface ContextInfo {
  activeApp: string;
  windowTitle?: string;
  detectedCategory?: 'browser' | 'code-editor' | 'chat' | 'email-client' | 'terminal' | 'word-processor' | 'general';
  suggestedMode?: WritingMode;
  selectedText?: string;
  recentClipboardSnippet?: string;
}

export interface AppSettings {
  // Shortcut & Recording
  recordingMode: 'push-to-talk' | 'toggle';
  pushToTalkShortcut: string;
  toggleShortcut: string;
  cancelShortcut: string;

  // Language & Translation
  defaultInputLanguage: string; // 'auto' or language code
  defaultOutputLanguage: OutputLanguageOption | string;
  autoDetectLanguage: boolean;
  preserveCodeSwitching: boolean;

  // AI & Modes
  activeWritingMode: WritingMode;
  enableFillerRemoval: boolean;
  enableSelfCorrection: boolean;
  enableSpokenFormatting: boolean;
  enableSpokenCommands: boolean;
  preserveTechnicalTerms: boolean;

  // Providers
  speechProvider: SpeechProviderType;
  aiProvider: AIProviderType;
  apiKeys: {
    openai?: string;
    groq?: string;
    gemini?: string;
    anthropic?: string;
    deepgram?: string;
    google?: string;
  };

  // Text Insertion & Clipboard
  autoPaste: boolean;
  restoreClipboard: boolean;
  clipboardRestoreDelayMs: number;
  insertionFallbackMethod: 'clipboard' | 'keystrokes' | 'manual';

  // Context & Privacy
  enableContextAwareness: boolean;
  collectWindowTitle: boolean;
  retainHistory: boolean;
  retainAudio: boolean;
  analyticsEnabled: boolean;
  localDataEncrypted: boolean;

  // Audio & Hardware
  inputDeviceId: string;
  soundFeedbackEnabled: boolean;
  microphoneSensitivity: number;

  // Appearance
  theme: 'dark' | 'light' | 'system';
  floatingBarPosition: 'top-center' | 'bottom-center' | 'bottom-right' | 'custom';
  floatingBarOpacity: number;
  waveformColor: string;
  onboardingCompleted: boolean;
}

export interface ProcessingRequest {
  audioBase64?: string;
  audioBlob?: Blob;
  mimeType?: string;
  rawTranscript?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  mode?: WritingMode;
  context?: ContextInfo;
  userDictionary?: DictionaryEntry[];
  snippets?: Snippet[];
}

export interface ProcessingResult {
  rawTranscript: string;
  finalText: string;
  detectedLanguage: string;
  confidence: number;
  durationMs: number;
  wordsCount: number;
  detectedMode: WritingMode;
  warnings?: string[];
  appliedTransformations: {
    fillersRemoved: number;
    selfCorrectionsApplied: number;
    dictionaryReplacements: number;
    snippetsExpanded: number;
    formattingApplied: string[];
    technicalTermsPreserved: string[];
  };
}

export interface UsageStatistics {
  totalMinutesDictated: number;
  totalWordsDictated: number;
  totalSessions: number;
  estimatedMinutesSaved: number;
  languageDistribution: Record<string, number>;
  modeDistribution: Record<string, number>;
}
