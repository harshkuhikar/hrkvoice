/**
 * HRKVoice Constants, Defaults, and Vocabulary
 */

import { AppSettings, WritingMode } from './types';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  // Shortcut & Recording
  recordingMode: 'push-to-talk',
  pushToTalkShortcut: 'Control+Alt+Space',
  toggleShortcut: 'Control+Shift+Space',
  cancelShortcut: 'Escape',

  // Language & Translation
  defaultInputLanguage: 'auto',
  defaultOutputLanguage: 'same_as_spoken',
  autoDetectLanguage: true,
  preserveCodeSwitching: true,

  // AI & Modes
  activeWritingMode: 'general',
  enableFillerRemoval: true,
  enableSelfCorrection: true,
  enableSpokenFormatting: true,
  enableSpokenCommands: true,
  preserveTechnicalTerms: true,

  // Providers
  speechProvider: 'mock',
  aiProvider: 'mock',
  apiKeys: {
    openai: '',
    groq: '',
    gemini: '',
    anthropic: '',
    deepgram: '',
    google: ''
  },

  // Text Insertion & Clipboard
  autoPaste: true,
  restoreClipboard: true,
  clipboardRestoreDelayMs: 350,
  insertionFallbackMethod: 'clipboard',

  // Context & Privacy
  enableContextAwareness: true,
  collectWindowTitle: true,
  retainHistory: true,
  retainAudio: false,
  analyticsEnabled: false,
  localDataEncrypted: true,

  // Audio & Hardware
  inputDeviceId: 'default',
  soundFeedbackEnabled: true,
  microphoneSensitivity: 1.0,

  // Appearance
  theme: 'dark',
  floatingBarPosition: 'top-center',
  floatingBarOpacity: 0.95,
  waveformColor: '#6366f1',
  onboardingCompleted: false
};

export const WRITING_MODES: {
  id: WritingMode;
  name: string;
  description: string;
  icon: string;
  badge: string;
}[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Clean transcription with proper punctuation and natural flow.',
    icon: 'feather',
    badge: 'Standard'
  },
  {
    id: 'email',
    name: 'Email Mode',
    description: 'Professional layout with greetings, well-spaced paragraphs, and sign-offs.',
    icon: 'mail',
    badge: 'Formal'
  },
  {
    id: 'chat',
    name: 'Chat Mode',
    description: 'Concise, natural, conversational responses ideal for Slack or WhatsApp.',
    icon: 'message-circle',
    badge: 'Casual'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Polished executive tone, structured corporate business communication.',
    icon: 'briefcase',
    badge: 'Business'
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Relaxed, authentic speaking style with minimal formal restructuring.',
    icon: 'coffee',
    badge: 'Relaxed'
  },
  {
    id: 'developer',
    name: 'Developer Mode',
    description: 'Understands camelCase, CLI commands, package names, code syntax, and frameworks.',
    icon: 'terminal',
    badge: 'Code-Aware'
  },
  {
    id: 'prompt',
    name: 'AI Prompt Mode',
    description: 'Optimized prompts with structured instructions for ChatGPT, Claude, Cursor, and Gemini.',
    icon: 'cpu',
    badge: 'LLM Ready'
  },
  {
    id: 'notes',
    name: 'Notes Mode',
    description: 'Markdown-friendly bullets, key takeaways, and structured meeting notes.',
    icon: 'file-text',
    badge: 'Productivity'
  }
];

export const TECHNICAL_DICTIONARY_PRESERVE: string[] = [
  'React', 'ReactJS', 'React Native', 'Node.js', 'JavaScript', 'TypeScript',
  'Tailwind', 'Tailwind CSS', 'GSAP', 'GitHub', 'GitLab', 'API', 'REST', 'RESTful',
  'JSON', 'HTML', 'HTML5', 'CSS', 'CSS3', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL',
  'MySQL', 'Redis', 'Docker', 'Kubernetes', 'K8s', 'AWS', 'GCP', 'Azure',
  'Vite', 'Next.js', 'Nuxt', 'Vue', 'Angular', 'Svelte', 'Electron', 'GraphQL',
  'Python', 'FastAPI', 'Django', 'Flask', 'Golang', 'Rust', 'Linux', 'Ubuntu',
  'VS Code', 'Cursor', 'WebAssembly', 'Wasm', 'Prisma', 'Drizzle', 'Supabase',
  'Firebase', 'OAuth', 'JWT', 'CI/CD', 'Webhook', 'Webhook', 'SDK', 'CLI',
  'Antigravity', 'ChatGPT', 'Claude', 'Gemini', 'Llama', 'Deepgram', 'Whisper',
  'Senaptiq', 'Vanaari', 'Scalezix', 'Qubeta'
];

export const COMMON_FILLER_WORDS = [
  'um', 'uh', 'uhm', 'umm', 'er', 'ah', 'hmm', 'hm',
  'like', 'you know', 'sort of', 'kind of', 'i mean',
  'basically', 'actually', 'literally'
];

export const INDIAN_FILLER_WORDS = [
  'matlab', 'yaani', 'toh', 'arre', 'bhai', 'yaar',
  'samjhe', 'dekho', 'suno', 'woh kya bolte hai'
];
