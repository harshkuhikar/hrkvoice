# Contributing to HRKVoice

Thank you for your interest in contributing to **HRKVoice** — an open-source, India-first multilingual voice productivity desktop platform.

---

## 1. Development Prerequisites

- **Node.js**: v20 or v22+
- **npm**: v10+
- **Operating System**: Windows 10/11 (macOS support planned)
- **Git**: v2.30+

---

## 2. Project Setup

```bash
# Clone the repository
git clone https://github.com/hrkvoice/hrkvoice.git
cd hrkvoice

# Copy environment configuration
cp .env.example .env

# Install dependencies across all monorepo workspaces
npm install

# Run automated tests to verify your setup
npm test
```

---

## 3. Running in Development

```bash
# Start the full desktop application in dev mode (Vite Renderer + Electron)
npm run dev

# Or start the web landing page & interactive showcase
npm run dev:web

# Or start the standalone backend API server
npm run dev:server
```

---

## 4. Code Standards & Testing

Before submitting a Pull Request:
1. Ensure all tests pass:
   ```bash
   npm test
   ```
2. Ensure TypeScript compilation passes:
   ```bash
   npm run build:packages
   ```
3. Maintain strict isolation: Never place API keys or plaintext credentials in source files.

---

## 5. Adding New Language Dialects or Providers

- To extend or calibrate Indian language metadata, modify `packages/shared/src/languages.ts`.
- To implement a new speech provider, implement `SpeechProvider` in `packages/speech/src/SpeechProvider.ts`.
- To implement a new AI provider, implement `AIProvider` in `packages/ai/src/AIProvider.ts`.
