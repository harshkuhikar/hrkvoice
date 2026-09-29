/**
 * Context Provider for HRKVoice
 * Identifies the currently focused application and suggests the appropriate writing mode.
 */

import { ContextInfo, WritingMode } from '@hrkvoice/shared';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface ContextOptions {
  enabled: boolean;
  collectWindowTitle: boolean;
}

export class ContextProvider {
  /**
   * Resolve active application and determine optimal writing mode
   */
  public static async getActiveContext(options: ContextOptions): Promise<ContextInfo> {
    if (!options.enabled) {
      return { activeApp: 'unknown', suggestedMode: 'general' };
    }

    try {
      if (process.platform === 'win32') {
        return await this.getWindowsActiveContext(options.collectWindowTitle);
      } else if (process.platform === 'darwin') {
        return await this.getMacActiveContext(options.collectWindowTitle);
      } else {
        return { activeApp: 'general-desktop', suggestedMode: 'general' };
      }
    } catch (err) {
      console.warn('[ContextProvider] Error resolving active window:', err);
      return { activeApp: 'desktop', suggestedMode: 'general' };
    }
  }

  /**
   * Windows-specific foreground window detection
   */
  private static async getWindowsActiveContext(includeTitle: boolean): Promise<ContextInfo> {
    const psScript = `
      Add-Type @"
        using System;
        using System.Runtime.InteropServices;
        using System.Text;
        public class WinDetect {
          [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
          [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
          [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
        }
"@
      $hwnd = [WinDetect]::GetForegroundWindow()
      $sb = New-Object System.Text.StringBuilder 256
      [void][WinDetect]::GetWindowText($hwnd, $sb, 256)
      $pid = 0
      [void][WinDetect]::GetWindowThreadProcessId($hwnd, [ref]$pid)
      $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
      @{ Process = $proc.ProcessName; Title = $sb.ToString() } | ConvertTo-Json -Compress
    `;

    try {
      const { stdout } = await execAsync(
        `powershell.exe -NoProfile -NonInteractive -Command "${psScript.replace(/\r?\n/g, ' ')}"`,
        { timeout: 1500 }
      );
      const data = JSON.parse(stdout.trim());
      const processName = (data.Process || 'unknown').toLowerCase();
      const rawTitle = data.Title || '';
      const windowTitle = includeTitle ? rawTitle : undefined;

      const category = this.categorizeProcess(processName, rawTitle);
      const suggestedMode = this.mapCategoryToMode(category);

      return {
        activeApp: processName,
        windowTitle,
        detectedCategory: category,
        suggestedMode
      };
    } catch {
      return { activeApp: 'windows-app', suggestedMode: 'general' };
    }
  }

  /**
   * macOS-specific foreground window detection
   */
  private static async getMacActiveContext(includeTitle: boolean): Promise<ContextInfo> {
    const script = `osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true'`;
    try {
      const { stdout } = await execAsync(script, { timeout: 1500 });
      const app = stdout.trim().toLowerCase();
      const category = this.categorizeProcess(app, '');
      return {
        activeApp: app,
        detectedCategory: category,
        suggestedMode: this.mapCategoryToMode(category)
      };
    } catch {
      return { activeApp: 'macos-app', suggestedMode: 'general' };
    }
  }

  private static categorizeProcess(
    proc: string,
    title: string
  ): 'browser' | 'code-editor' | 'chat' | 'email-client' | 'terminal' | 'word-processor' | 'general' {
    const t = title.toLowerCase();

    // Code editors & IDEs
    if (['code', 'cursor', 'webstorm', 'idea64', 'pycharm64', 'devenv', 'sublime_text'].includes(proc)) {
      return 'code-editor';
    }

    // Terminals
    if (['windowsterminal', 'powershell', 'cmd', 'bash', 'wsl', 'mintty'].includes(proc)) {
      return 'terminal';
    }

    // Chat and messaging
    if (['slack', 'discord', 'whatsapp', 'telegram', 'teams'].includes(proc)) {
      return 'chat';
    }

    // Email
    if (['outlook', 'thunderbird'].includes(proc)) {
      return 'email-client';
    }

    // Word processors / Notes
    if (['winword', 'notion', 'obsidian', 'onenote'].includes(proc)) {
      return 'word-processor';
    }

    // Browsers: check title if available
    if (['chrome', 'msedge', 'firefox', 'brave', 'opera'].includes(proc)) {
      if (t.includes('chatgpt') || t.includes('claude') || t.includes('gemini') || t.includes('cursor')) {
        return 'code-editor'; // AI prompt / coding
      }
      if (t.includes('gmail') || t.includes('outlook') || t.includes('mail')) {
        return 'email-client';
      }
      if (t.includes('whatsapp') || t.includes('slack') || t.includes('discord')) {
        return 'chat';
      }
      return 'browser';
    }

    return 'general';
  }

  private static mapCategoryToMode(category: string): WritingMode {
    switch (category) {
      case 'code-editor':
      case 'terminal':
        return 'developer';
      case 'email-client':
        return 'email';
      case 'chat':
        return 'chat';
      case 'word-processor':
        return 'notes';
      default:
        return 'general';
    }
  }
}
