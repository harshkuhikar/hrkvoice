/**
 * Typed IPC Channel Handlers for HRKVoice Desktop
 */

import { ipcMain, BrowserWindow } from 'electron';
import { DesktopTextInsertionService } from './insertion';
import { ContextProvider } from '@hrkvoice/context';
import { WindowManager } from './windows';

export function registerIpcHandlers(
  windowManager: WindowManager,
  insertionService: DesktopTextInsertionService
): void {
  // 1. Text Insertion into active external application
  ipcMain.handle('hrkvoice:insert-text', async (_, text: string, options) => {
    return await insertionService.insertText(text, options);
  });

  // 2. Direct Clipboard Copy
  ipcMain.handle('hrkvoice:copy-text', (_, text: string) => {
    return insertionService.copyDirect(text);
  });

  // 3. Active Window and App Context Detection
  ipcMain.handle('hrkvoice:get-context', async (_, options: { enabled: boolean; collectWindowTitle: boolean }) => {
    return await ContextProvider.getActiveContext(options);
  });

  // 4. Floating Bar Control
  ipcMain.handle('hrkvoice:show-floating-bar', () => {
    windowManager.showFloatingBar();
  });

  ipcMain.handle('hrkvoice:hide-floating-bar', () => {
    windowManager.hideFloatingBar();
  });

  // 5. Main Window Control (Opens application directly, restores if minimized, and passes text)
  ipcMain.handle('hrkvoice:show-main-window', (_, targetView?: string, text?: string) => {
    const win = windowManager.createMainWindow();
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
    if (targetView || text) {
      win.webContents.send('hrkvoice:dictation-completed', {
        view: targetView || 'scratchpad',
        text: text || ''
      });
    }
  });

  // 6. Broadcast recording state between floating bar and main window
  ipcMain.on('hrkvoice:sync-recording-state', (_, payload) => {
    const main = windowManager.getMainWindow();
    const bar = windowManager.getFloatingBarWindow();
    if (main && !main.isDestroyed()) {
      main.webContents.send('hrkvoice:on-recording-state', payload);
    }
    if (bar && !bar.isDestroyed()) {
      bar.webContents.send('hrkvoice:on-recording-state', payload);
    }
  });

  // 7. Broadcast audio levels for visualizer
  ipcMain.on('hrkvoice:sync-audio-level', (_, level: number) => {
    const bar = windowManager.getFloatingBarWindow();
    if (bar && !bar.isDestroyed()) {
      bar.webContents.send('hrkvoice:on-audio-level', level);
    }
  });
}
