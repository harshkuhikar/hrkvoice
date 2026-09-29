/**
 * Global Shortcut Manager for HRKVoice Desktop
 * Handles global push-to-talk, toggle recording, and escape cancellation
 */

import { globalShortcut, BrowserWindow } from 'electron';

export class GlobalShortcutManager {
  private pushToTalkShortcut = 'CommandOrControl+Alt+Space';
  private toggleShortcut = 'CommandOrControl+Shift+Space';
  private cancelShortcut = 'Escape';
  private isRecording = false;

  public registerShortcuts(
    windows: { getMainWindow: () => BrowserWindow | null; getFloatingBarWindow: () => BrowserWindow | null },
    onToggle: (state: boolean) => void,
    onCancel: () => void
  ): void {
    // Unregister any existing shortcuts
    globalShortcut.unregisterAll();

    // 1. Toggle recording shortcut (press to start, press to stop)
    try {
      const toggleSuccess = globalShortcut.register(this.toggleShortcut, () => {
        this.isRecording = !this.isRecording;
        onToggle(this.isRecording);
      });
      if (!toggleSuccess) {
        console.warn(`[ShortcutManager] Failed to register toggle shortcut: ${this.toggleShortcut}`);
      }
    } catch (err) {
      console.warn('[ShortcutManager] Shortcut registration error:', err);
    }

    // 2. Push-to-talk primary shortcut
    try {
      const pttSuccess = globalShortcut.register(this.pushToTalkShortcut, () => {
        // Toggle on press
        this.isRecording = !this.isRecording;
        onToggle(this.isRecording);
      });
      if (!pttSuccess) {
        console.warn(`[ShortcutManager] Conflict registering shortcut: ${this.pushToTalkShortcut}`);
      }
    } catch (err) {
      console.warn('[ShortcutManager] PTT registration error:', err);
    }

    // 3. Cancel shortcut (Escape)
    try {
      globalShortcut.register(this.cancelShortcut, () => {
        if (this.isRecording) {
          this.isRecording = false;
          onCancel();
        }
      });
    } catch (err) {
      console.warn('[ShortcutManager] Cancel shortcut registration warning:', err);
    }
  }

  public updateShortcuts(ptt: string, toggle: string): void {
    this.pushToTalkShortcut = ptt || this.pushToTalkShortcut;
    this.toggleShortcut = toggle || this.toggleShortcut;
  }

  public unregisterAll(): void {
    globalShortcut.unregisterAll();
  }
}
