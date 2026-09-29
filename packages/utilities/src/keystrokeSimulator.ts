/**
 * Keystroke Simulation Utility for HRKVoice
 * Simulates OS paste keystrokes (Ctrl+V on Windows/Linux, Cmd+V on macOS)
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class KeystrokeSimulator {
  /**
   * Simulates a system paste shortcut in the currently focused application
   */
  public static async simulatePaste(platform = process.platform): Promise<boolean> {
    try {
      if (platform === 'win32') {
        // Windows: Send Ctrl+V using PowerShell SendKeys
        // Add-Type loads Windows Forms assembly, then sends ^{v} (Ctrl+V)
        const psCommand = `powershell.exe -NoProfile -NonInteractive -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^v')"`;
        await execAsync(psCommand, { timeout: 3000 });
        return true;
      } else if (platform === 'darwin') {
        // macOS: osascript Cmd+V
        const appleScript = `osascript -e 'tell application "System Events" to keystroke "v" using command down'`;
        await execAsync(appleScript, { timeout: 3000 });
        return true;
      } else {
        // Linux: xdotool key ctrl+v
        const linuxCommand = `xdotool key ctrl+v`;
        await execAsync(linuxCommand, { timeout: 3000 });
        return true;
      }
    } catch (error: any) {
      console.warn('[KeystrokeSimulator] Simulation warning:', error.message || error);
      // Return false so caller can trigger appropriate clipboard copy feedback
      return false;
    }
  }

  /**
   * Fallback: simulated direct typing of characters if clipboard is blocked
   */
  public static async simulateTyping(text: string, platform = process.platform): Promise<boolean> {
    if (!text) return true;
    try {
      if (platform === 'win32') {
        // Escape special SendKeys characters: +, ^, %, ~, (, ), {, }
        const escaped = text.replace(/([+^%~(){}[\]])/g, '{$1}');
        const script = `powershell.exe -NoProfile -NonInteractive -Command "$s = @'\\n${escaped.replace(/'/g, "''")}\\n'@; Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait($s)"`;
        await execAsync(script, { timeout: 5000 });
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[KeystrokeSimulator] Typing fallback failed:', err);
      return false;
    }
  }
}
