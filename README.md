# HRKVoice

<div align="center">

**Speak Naturally. Write Instantly.**

*An AI-powered multilingual voice-to-text and voice-to-command desktop application built for India’s 22 scheduled languages, English code-switching (Hinglish), and developer workflows.*

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows_10%2F11-0078D6.svg)](https://microsoft.com)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-3178C6.svg)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/Tests-45%2F45_Passed-brightgreen.svg)]()

</div>

---

## 📖 What is HRKVoice?

**HRKVoice** is a desktop-first voice productivity application inspired by modern AI dictation tools, but independently engineered from the ground up for the Indian linguistic reality.

In normal Indian daily life and software engineering, people rarely speak in textbook English or pure formal Hindi. They speak naturally:
> *"Bhai kal client ko React project ka demo send kar dena, actually Rahul ko nahi Rohit ko bhejna."*

Most Western voice dictation tools fail here — they either mangle regional words, erase technical terms, or preserve hesitations and speech repairs blindly.

**HRKVoice solves this:**
1. **Global Shortcut**: Press `Ctrl + Alt + Space` anywhere in Windows (VS Code, Chrome, Slack, WhatsApp, Word, Terminal).
2. **Natural Indian Speech**: Speak naturally in Hindi, Gujarati, Bengali, Tamil, Telugu, Marathi, Punjabi, or any of 23 supported languages.
3. **AI Speech Repair**: Self-corrections (*"Rahul, actually Rohit"*) and fillers (*"um, uh, matlab"*) are automatically cleaned without changing your intent.
4. **Hinglish & Tech Safeguard**: Developer terms (`React`, `Node.js`, `API`, `GitHub`, `PostgreSQL`) retain exact casing.
5. **Instant Insertion**: Text is injected directly into your currently active window while safely preserving your clipboard.

---

## ✨ Key Features

- **Multilingual India-First**: Native support for all 22 Eighth-Schedule official Indian languages + Indian English.
- **Speech Self-Correction**: Seamlessly overrides speech repairs (*"five o'clock, no wait six"* $\to$ *"six o'clock"*).
- **Intelligent Filler Removal**: Strips hesitations (*um, uh, er, hmm, matlab*) without blindly deleting meaningful words.
- **Dedicated Developer Mode**: Understands `camelCase` hooks (`useEffect`), `PascalCase` components (`UserProfileCard`), CLI commands (`npm install react-router-dom`), and git commits.
- **Specialized Writing Modes**:
  - **General**: Universal punctuated dictation
  - **Email**: Professional layout with greetings, clean paragraphs, and sign-offs
  - **Chat**: Crisp, conversational flow for WhatsApp, Slack, and Discord
  - **Professional**: Corporate tone for proposals and client memos
  - **Casual**: Authentic, relaxed voice
  - **Developer**: Code identifiers, packages, and syntax
  - **AI Prompt**: Structured instructions tailored for ChatGPT, Claude, Cursor, and Gemini
  - **Notes**: Markdown-formatted bullets and takeaways
- **Personal & Domain Dictionary**: Add custom company names, colleague names, and domain terminology with pronunciation matching and CSV/JSON import/export.
- **Voice Snippets**: Trigger full templates with short spoken phrases (*"my email"* $\to$ signature).
- **Context-Aware Mode Switching**: Auto-detects active application (e.g. VS Code $\to$ Developer Mode, Outlook $\to$ Email Mode).
- **Safe Clipboard Restoration**: Pastes into active windows via simulated keystrokes and restores original clipboard content after 350ms.
- **Zero Raw Audio Retention**: Audio is never written to disk; processed in volatile RAM only. Local storage is encrypted with `AES-256-GCM`.
- **Offline / Demo Mode**: Out-of-the-box local operation without requiring paid cloud API keys.

---

## 🏛 Architecture & Tech Stack

```
hrkvoice/
├── apps/
│   ├── desktop/             # Electron desktop application (Main, Preload, React Renderer)
│   └── web-dashboard/       # Marketing landing page & interactive web showcase
├── packages/
│   ├── shared/              # Central language registry, types, constants, sample phrases
│   ├── speech/              # SpeechProvider abstraction (Groq, OpenAI, Deepgram, Google, Mock)
│   ├── ai/                  # Multi-stage AI pipeline, prompts, formatting, repairs
│   ├── dictionary/          # Personal vocabulary and snippet expansion engines
│   ├── context/             # Windows active window & foreground app detection
│   └── utilities/           # Safe clipboard, keystroke simulator, AES-256 encryption
├── server/                  # Local Express REST API (port 4321) & JSON document DB
├── tests/                   # Comprehensive Vitest unit and integration test suite
├── docs/                    # Architectural and developer documentation
└── scripts/                 # Build, package, and diagnostic verification scripts
```

### Technologies Used
- **Desktop Shell**: Electron 33 (Context isolation enabled, Node integration disabled, strict CSP)
- **Frontend**: React 18, Vite 6, Tailwind CSS 3, Lucide Icons
- **Language**: TypeScript 5 throughout monorepo
- **Local API**: Express 4, embedded directly in Electron or runnable standalone
- **Testing**: Vitest 2 (Unit & Integration tests)
- **Packaging**: electron-builder (NSIS installer for Windows)

---

## 🌐 Supported Languages (23 Total)

| Language | Script | ISO Code | Speech Providers | Code-Switching |
|---|---|---|---|---|
| **English** | Latin | `en` | Groq, OpenAI, Deepgram, Google, Mock | Yes |
| **Hindi (हिन्दी)** | Devanagari | `hi` | Groq, OpenAI, Deepgram, Google, Mock | Yes (Hinglish) |
| **Gujarati (ગુજરાતી)** | Gujarati | `gu` | Groq, OpenAI, Deepgram, Google, Mock | Yes (Gujlish) |
| **Bengali (বাংলা)** | Bengali | `bn` | Groq, OpenAI, Deepgram, Google, Mock | Yes (Benglish) |
| **Marathi (मराठी)** | Devanagari | `mr` | Groq, OpenAI, Deepgram, Google, Mock | Yes |
| **Tamil (தமிழ்)** | Tamil | `ta` | Groq, OpenAI, Deepgram, Google, Mock | Yes (Tanglish) |
| **Telugu (తెలుగు)** | Telugu | `te` | Groq, OpenAI, Deepgram, Google, Mock | Yes (Tenglish) |
| **Kannada (ಕನ್ನಡ)** | Kannada | `kn` | Groq, OpenAI, Deepgram, Google, Mock | Yes (Kanglish) |
| **Malayalam (മലയാളം)** | Malayalam | `ml` | Groq, OpenAI, Deepgram, Google, Mock | Yes (Manglish) |
| **Punjabi (ਪੰਜਾਬੀ)** | Gurmukhi | `pa` | Groq, OpenAI, Deepgram, Google, Mock | Yes |
| **Odia (ଓଡ଼ିଆ)** | Odia | `or` | Groq, OpenAI, Google, Mock | Yes |
| **Assamese (অসমীয়া)** | Bengali-Assamese | `as` | Groq, OpenAI, Google, Mock | Yes |
| **Urdu (اردو)** | Perso-Arabic | `ur` | Groq, OpenAI, Deepgram, Google, Mock | Yes |
| **Sanskrit (संस्कृतम्)** | Devanagari | `sa` | OpenAI, Google, Mock | Pure |
| **Nepali (नेपाली)** | Devanagari | `ne` | Groq, OpenAI, Google, Mock | Yes |
| **Konkani (कोंकणी)** | Devanagari | `kok` | OpenAI, Google, Mock | Yes |
| **Maithili (मैथिली)** | Devanagari | `mai` | OpenAI, Google, Mock | Yes |
| **Dogri (डोगरी)** | Devanagari | `doi` | Google, Mock | Yes |
| **Kashmiri (کٲشُر)** | Perso-Arabic / Deva | `ks` | Google, Mock | Yes |
| **Sindhi (سنڌي)** | Perso-Arabic / Deva | `sd` | OpenAI, Google, Mock | Yes |
| **Manipuri (মৈতৈলোন্)** | Meetei Mayek / Beng | `mni` | Google, Mock | Yes |
| **Bodo (बड़ो)** | Devanagari | `brx` | Google, Mock | Yes |
| **Santali (ᱥᱟᱱᱛᱟᱲᱤ)** | Ol Chiki / Deva | `sat` | Google, Mock | Yes |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Windows 10 or 11 (64-bit)
- Node.js v20+ or v22+
- npm v10+

### 1. Clone & Install
```bash
git clone https://github.com/hrkvoice/hrkvoice.git
cd hrkvoice
npm install
```

### 2. Configure Environment (Optional)
HRKVoice includes an offline Demo Mode that works without any keys. To enable high-speed cloud speech or LLMs:
```bash
cp .env.example .env
```
Add your keys (Groq, OpenAI, Gemini, or Deepgram). Keys can also be added directly inside the desktop Settings UI.

### 3. Run Automated Tests
```bash
npm test
```
*Executes all 45 automated unit and integration tests.*

### 4. Start Development
```bash
# Start the full desktop app in development mode
npm run dev

# Or start the web landing page & showcase
npm run dev:web
```

---

## 📦 Building the Windows Installer

To generate a standalone Windows installer (`HRKVoice-Setup-1.0.0.exe`):

```bash
# Compile packages, server, renderer, and build installer
node scripts/package-windows.js
```
The installer is generated in the `release/` directory.

---

## 🔒 Security & Privacy Guarantees

1. **Zero Raw Audio Storage**: Audio buffers are held strictly in memory during the transcription request and immediately purged.
2. **Context Isolation**: Renderer windows have zero direct Node.js system access.
3. **Local Encryption**: Stored credentials are encrypted with `AES-256-GCM` using machine-derived PBKDF2 keys.
4. **Granular Controls**: Turn off local history or context awareness with one click in the Privacy Center.
5. **No Key Leaks**: Frontend bundles never contain private API keys.

---

## 📚 Documentation Links

- [System Architecture](docs/architecture.md)
- [Language Support & Registry](docs/language-support.md)
- [AI Text Processing Pipeline](docs/ai-pipeline.md)
- [Speech Providers & Fallback Chains](docs/speech-providers.md)
- [Security Specification](docs/security.md)
- [Privacy Center & Data Controls](docs/privacy.md)
- [Windows Desktop Integration](docs/desktop-integration.md)
- [Contributing Guide](docs/contributing.md)

---

## 📄 License

Licensed under the [Apache License, Version 2.0](LICENSE).
Copyright 2026 HRKVoice Authors and Contributors.
