/**
 * Text Insertion Service for HRKVoice Desktop
 * Injects multilingual text into active focused application while restoring user's clipboard
 */

import { clipboard } from 'electron';
import { SafeClipboardService, KeystrokeSimulator } from '@hrkvoice/utilities';

export class DesktopTextInsertionService {
  private clipboardService: SafeClipboardService;

  constructor() {
    this.clipboardService = new SafeClipboardService({
      readText: () => clipboard.readText(),
      writeText: (t: string) => clipboard.writeText(t)
    });
  }

  /**
   * Insert text into the active external application
   */
  public async insertText(
    text: string,
    options: { restoreClipboard?: boolean; restoreDelayMs?: number } = {}
  ): Promise<{ success: boolean; method: string; error?: string }> {
    if (!text || text.trim().length === 0) {
      return { success: true, method: 'noop' };
    }

    const restore = options.restoreClipboard !== false;
    const delay = options.restoreDelayMs || 350;

    // Verify Unicode Indian script integrity
    const isUnicodeValid = SafeClipboardService.verifyUnicodeIntegrity(text);
    if (!isUnicodeValid) {
      console.warn('[TextInsertion] Unicode encoding mismatch detected.');
    }

    try {
      if (restore) {
        const result = await this.clipboardService.insertWithClipboardPreservation(
          text,
          async () => {
            // Small pause to allow OS clipboard update
            await new Promise(r => setTimeout(r, 40));
            // Simulate Ctrl+V on Windows
            await KeystrokeSimulator.simulatePaste();
          },
          delay
        );

        if (result.success) {
          return { success: true, method: 'clipboard-paste-preserved' };
        }
      }

      // Fallback: Direct write to clipboard without restoration if user disabled restoration
      this.clipboardService.copyToClipboard(text);
      await KeystrokeSimulator.simulatePaste();
      return { success: true, method: 'clipboard-paste-direct' };
    } catch (err: any) {
      console.error('[TextInsertion] Failed to insert text:', err);
      // Ensure text is at least on clipboard
      this.clipboardService.copyToClipboard(text);
      return {
        success: false,
        method: 'clipboard-copy-fallback',
        error: `Auto-insertion could not simulate keystroke. Text was copied to clipboard instead: ${err.message}`
      };
    }
  }

  public copyDirect(text: string): boolean {
    return this.clipboardService.copyToClipboard(text);
  }
}
