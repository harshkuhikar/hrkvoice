/**
 * Electron Main Process Entrypoint for HRKVoice Desktop
 */

import { app, BrowserWindow } from 'electron';
import { configureSecurityPolicies } from './security';
import { WindowManager } from './windows';
import { GlobalShortcutManager } from './shortcuts';
import { DesktopTextInsertionService } from './insertion';
import { SystemTrayManager } from './tray';
import { registerIpcHandlers } from './ipc';

// Embedded local API server so HRKVoice works out-of-the-box
import { createApp } from '@hrkvoice/server';

// Ensure single instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

let windowManager: WindowManager;
let shortcutManager: GlobalShortcutManager;
let trayManager: SystemTrayManager;
let insertionService: DesktopTextInsertionService;
let localServer: any;

app.whenReady().then(async () => {
  // 1. Configure security headers & CSP
  configureSecurityPolicies();

  // 2. Start embedded local API server on port 4321 safely
  try {
    const apiApp = createApp();
    localServer = apiApp.listen(4321, () => {
      console.log('[Electron Main] Local HRKVoice Server listening on http://localhost:4321');
    });
    localServer.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log('[Electron Main] Port 4321 is already active. Connected to existing HRKVoice backend.');
      } else {
        console.warn('[Electron Main] Server notice:', err.message);
      }
    });
  } catch (serverErr: any) {
    console.warn('[Electron Main] Note: Local server port may already be active:', serverErr?.message);
  }

  process.on('uncaughtException', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log('[Electron Main] Port already bound, continuing gracefully without interruption.');
      return;
    }
    console.warn('[Electron Main] Uncaught notice:', err.message);
  });

  // 3. Initialize Window and Insertion Services
  windowManager = new WindowManager();
  insertionService = new DesktopTextInsertionService();
  shortcutManager = new GlobalShortcutManager();
  trayManager = new SystemTrayManager();

  // 4. Register IPC Handlers
  registerIpcHandlers(windowManager, insertionService);

  // 5. Create Main Dashboard and Floating Bar Windows
  const mainWindow = windowManager.createMainWindow();
  const floatingBar = windowManager.createFloatingBarWindow();

  // 6. Initialize System Tray
  trayManager.initialize({
    getMainWindow: () => windowManager.getMainWindow(),
    getFloatingBarWindow: () => windowManager.getFloatingBarWindow(),
    showMainWindow: () => windowManager.createMainWindow().show(),
    toggleRecording: () => {
      // Send toggle trigger to active window
      const win = windowManager.getFloatingBarWindow() || mainWindow;
      win.webContents.send('hrkvoice:trigger-recording-toggle');
    }
  });

  // 7. Register Global Shortcuts
  shortcutManager.registerShortcuts(
    {
      getMainWindow: () => windowManager.getMainWindow(),
      getFloatingBarWindow: () => windowManager.getFloatingBarWindow()
    },
    (isRecording) => {
      if (isRecording) {
        windowManager.showFloatingBar();
      }
      const targetWin = windowManager.getFloatingBarWindow() || mainWindow;
      targetWin.webContents.send('hrkvoice:shortcut-recording-toggled', isRecording);
    },
    () => {
      windowManager.hideFloatingBar();
      const targetWin = windowManager.getFloatingBarWindow() || mainWindow;
      targetWin.webContents.send('hrkvoice:shortcut-recording-cancelled');
    }
  );

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createMainWindow();
    }
  });
});

app.on('second-instance', () => {
  const main = windowManager?.getMainWindow();
  if (main) {
    if (main.isMinimized()) main.restore();
    main.show();
    main.focus();
  }
});

app.on('will-quit', () => {
  shortcutManager?.unregisterAll();
  trayManager?.destroy();
  if (localServer) {
    localServer.close();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Keep in tray unless user explicitly quit from tray
  }
});
