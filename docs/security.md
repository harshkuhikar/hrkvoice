# HRKVoice — Security Specification

HRKVoice adheres to current Electron and desktop application security standards.

---

## 1. Electron Isolation Architecture

1. **Context Isolation**: `contextIsolation: true` is strictly enforced on all BrowserWindows (Main Dashboard and Floating Pill).
2. **No Node.js Integration in Renderer**: `nodeIntegration: false` prevents any malicious script from executing arbitrary OS shell commands.
3. **Preload API Bridge**: Only strictly typed, minimal IPC methods (`insertText`, `getContext`, `showFloatingBar`) are exposed via `contextBridge.exposeInMainWorld()`.
4. **Sandboxing**: Renderer processes run in sandboxed contexts without access to internal Electron internals.

---

## 2. Content Security Policy (CSP)

A strict Content-Security-Policy header is configured via `session.defaultSession.webRequest.onHeadersReceived`:
- Restricts `script-src` and `style-src` to application bundles.
- Limits `connect-src` strictly to `localhost` and explicitly whitelisted AI/Speech cloud endpoints (`api.groq.com`, `api.openai.com`, `api.deepgram.com`, `speech.googleapis.com`, `generativelanguage.googleapis.com`, `api.anthropic.com`).
- Disables `webview` tags and prevents navigation away from local bundled assets.

---

## 3. Credential & Key Security

- **No Secrets in Bundles**: API keys are never compiled into client-side renderer JavaScript bundles.
- **Local Storage Encryption**: Sensitive keys in `hrkvoice-store.json` are encrypted using `AES-256-GCM` with key derivation via PBKDF2 (`LocalEncryptionService`).
- **Masked Presentation**: All API keys displayed in the UI are masked (`sk-...a4b1`).
- **Zero Logging Policy**: Raw credentials and full private transcripts are explicitly omitted from production logs.
