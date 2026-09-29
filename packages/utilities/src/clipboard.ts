/**
 * Safe Clipboard Operations and Restoration for HRKVoice
 * Preserves user clipboard while inserting multilingual text
 */

export interface ClipboardAdapter {
  readText(): string;
  writeText(text: string): void;
}

export class SafeClipboardService {
  private adapter: ClipboardAdapter;

  constructor(adapter?: ClipboardAdapter) {
    if (adapter) {
      this.adapter = adapter;
    } else {
      // Default fallback memory adapter if electron/native isn't passed
      let memoryStore = '';
      this.adapter = {
        readText: () => memoryStore,
        writeText: (t: string) => { memoryStore = t; }
      };
    }
  }

  public setAdapter(adapter: ClipboardAdapter): void {
    this.adapter = adapter;
  }

  /**
   * Writes text to clipboard, then calls pasteAction,
   * and subsequently restores the original clipboard content.
   */
  public async insertWithClipboardPreservation(
    textToInsert: string,
    pasteAction: () => Promise<void> | void,
    restoreDelayMs = 350
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Read existing clipboard text
      const previousText = this.adapter.readText();

      // 2. Set new text to insert (full Unicode support)
      this.adapter.writeText(textToInsert);

      // 3. Trigger paste action
      await pasteAction();

      // 4. Restore original clipboard content after configured delay
      if (restoreDelayMs > 0) {
        setTimeout(() => {
          try {
            // Only restore if user hasn't copied something new in the meantime
            const currentClip = this.adapter.readText();
            if (currentClip === textToInsert) {
              this.adapter.writeText(previousText);
            }
          } catch (restoreErr) {
            console.warn('[SafeClipboardService] Error restoring clipboard:', restoreErr);
          }
        }, restoreDelayMs);
      }

      return { success: true };
    } catch (err: any) {
      console.error('[SafeClipboardService] Failed to insert with clipboard:', err);
      return { success: false, error: err.message || String(err) };
    }
  }

  /**
   * Direct write without auto-restoration
   */
  public copyToClipboard(text: string): boolean {
    try {
      this.adapter.writeText(text);
      return true;
    } catch (err) {
      console.error('[SafeClipboardService] Copy failed:', err);
      return false;
    }
  }

  /**
   * Verify Unicode integrity of Indian language script
   */
  public static verifyUnicodeIntegrity(sampleText: string): boolean {
    const roundTripped = Buffer.from(sampleText, 'utf8').toString('utf8');
    return roundTripped === sampleText;
  }
}
