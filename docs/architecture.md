# HRKVoice — System Architecture

HRKVoice is an enterprise-grade, desktop-first, multilingual AI voice productivity application designed specifically for Indian languages, regional accents, and English code-switching (Hinglish, Gujlish, etc.).

---

## 1. High-Level Architectural Diagram

```
+--------------------------------------------------------------------------+
|                        WINDOWS 10/11 OPERATING SYSTEM                    |
+--------------------------------------------------------------------------+
       ^                                              |
       |  Ctrl+Alt+Space (Global PTT)                 |  Simulated Keystroke
       |  System Tray Events                          v  Direct Clipboard Paste
+--------------------------------------------------------------------------+
|                  ELECTRON MAIN PROCESS (Node.js runtime)                 |
|                                                                          |
|  * GlobalShortcutManager   * SystemTrayManager    * ContextProvider      |
|  * WindowManager           * DesktopTextInsertion * Embedded API Server  |
|    - Dashboard (Main)        (Safe Clipboard &      (Express Port 4321)  |
|    - Floating Pill           Keystroke Simulator)                        |
+--------------------------------------------------------------------------+
       |                                              ^
       | Secure IPC (Context Isolation, Preload)     | JSON REST / WebSocket
       v                                              v
+-----------------------------+       +------------------------------------+
|  ELECTRON RENDERER PROCESS  |       |        LOCAL BACKEND SERVICE       |
|  (React 18 + Vite + Tailwind|       |        (Express API Server)        |
|                             |       |                                    |
|  * Floating Bar Overlay     |       |  * SpeechManager                   |
|  * Audio Visualizer (Web    |       |    - Groq / OpenAI / Deepgram /    |
|    Audio API Analyser)      |       |      Google / Local Mock Provider  |
|  * Live Scratchpad          |       |  * AIManager                       |
|  * Central Language Matrix  |       |    - Multi-stage pipeline          |
|  * Personal Dictionary      |       |    - Groq / OpenAI / Gemini / Mock |
|  * Snippet Expansions       |       |  * DatabaseStore                   |
|  * Privacy Center           |       |    - Atomic disk writes & AES-256  |
|  * Onboarding Wizard        |       |  * History & Analytics             |
+-----------------------------+       +------------------------------------+
```

---

## 2. Core Architectural Principles

### 2.1 Provider Abstraction
Neither speech-to-text nor AI processing is hardcoded to a single vendor. 
- **Speech**: Standardized behind the `SpeechProvider` interface with adapters for Groq Whisper Large v3, OpenAI Whisper-1, Deepgram Nova-2, Google Cloud Speech, and an Offline/Demo Provider.
- **AI Processing**: Standardized behind the `AIProvider` interface with adapters for Groq Llama 3.3 70B, OpenAI GPT-4o-mini, Google Gemini 2.0 Flash, Anthropic Claude 3.5, and a Local Deterministic NLP Engine.

### 2.2 Fallback Chains
1. **Primary Provider** -> Checks configuration & credentials.
2. **Capability Check** -> Confirms the provider supports the selected Indian language code.
3. **Fallback Cloud Provider** -> Automatically shifts to other active keys if network or quota errors occur.
4. **Local Offline Engine** -> Provides guaranteed graceful degradation without user workflow interruptions.

### 2.3 Desktop-First Text Insertion
HRKVoice replaces clumsy copy-pasting with instant OS-level text injection:
1. Backs up user's active clipboard contents.
2. Writes cleaned, UTF-8 validated Indian text to system clipboard.
3. Simulates native paste shortcut (`Ctrl+V` on Windows) in the foreground window.
4. Restores original clipboard content after 350ms so user's clipboard history remains intact.

### 2.4 Privacy & Local Vault
- **Zero Raw Audio Retention**: Audio chunks exist only in RAM during transcription.
- **Local Data Encryption**: API keys and local preferences are encrypted via AES-256-GCM using PBKDF2 machine-derived salts.
- **Configurable History**: Dictation logs can be toggled off or cleared completely at any time.
