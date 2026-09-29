# HRKVoice — Windows Desktop Integration

HRKVoice is designed to feel like a lightweight, native Windows productivity utility.

---

## 1. Global Shortcuts Engine

HRKVoice registers global hotkeys via Electron's `globalShortcut` API:
- **Push-to-Talk**: `CommandOrControl+Alt+Space`
- **Toggle Recording**: `CommandOrControl+Shift+Space`
- **Cancel Recording**: `Escape`

The global shortcuts work even when HRKVoice is completely minimized or sitting silently in the Windows system tray.

---

## 2. Floating Recording Bar

When voice recording starts anywhere in Windows:
1. The `FloatingBarWindow` (a frameless, transparent, `alwaysOnTop` overlay) is positioned at the top-center of the screen.
2. The user sees a live red listening pulse, duration counter, current language badge, and dynamic audio waveform visualizer.
3. Upon releasing the shortcut or clicking stop, the pill displays a brief "Processing..." spinner, injects text into the active foreground window, displays "Inserted!", and hides itself automatically.

---

## 3. Safe Clipboard Text Insertion

To ensure seamless compatibility across all Windows applications (Chrome, VS Code, Slack, WhatsApp, Notion, Word, Terminal) without requiring app-specific plugins:
1. HRKVoice captures the user's existing clipboard text.
2. Writes the polished multilingual text to the system clipboard (with verified UTF-8 encoding for Indian scripts).
3. Executes a simulated `Ctrl+V` key combination via PowerShell `[System.Windows.Forms.SendKeys]::SendWait('^v')`.
4. After a configurable delay (default: 350ms), the user's prior clipboard content is safely restored.
