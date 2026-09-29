/**
 * System Tray Integration for HRKVoice Desktop
 */

import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron';
import path from 'path';

export class SystemTrayManager {
  private tray: Tray | null = null;
  private isPaused = false;

  public initialize(
    windows: {
      getMainWindow: () => BrowserWindow | null;
      getFloatingBarWindow: () => BrowserWindow | null;
      showMainWindow: () => void;
      toggleRecording: () => void;
    },
    activeLanguage = 'Auto Detect'
  ): Tray {
    if (this.tray) return this.tray;

    // Create an elegant 16x16 icon programmatically if asset file not yet packaged
    const icon = nativeImage.createFromBuffer(
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMklEQVR42mNkYPj/nwEHYGJAASNGDRg1YBRMAW8oyklyc7BhTjQOQ4yBf9R4oDEYqgUAPN8b4W78Q9sAAAAASUVORK5CYII=',
        'base64'
      )
    );

    this.tray = new Tray(icon);
    this.tray.setToolTip('HRKVoice - India-First Voice Productivity');

    const updateContextMenu = () => {
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'HRKVoice Active',
          enabled: false
        },
        {
          label: `Language: ${activeLanguage}`,
          enabled: false
        },
        { type: 'separator' },
        {
          label: 'Toggle Dictation (Ctrl+Alt+Space)',
          click: () => windows.toggleRecording()
        },
        {
          label: this.isPaused ? 'Resume Voice Capture' : 'Pause Voice Capture',
          click: () => {
            this.isPaused = !this.isPaused;
            updateContextMenu();
          }
        },
        { type: 'separator' },
        {
          label: 'Open Dashboard',
          click: () => windows.showMainWindow()
        },
        {
          label: 'Settings',
          click: () => {
            windows.showMainWindow();
            windows.getMainWindow()?.webContents.send('navigate-to', 'settings');
          }
        },
        { type: 'separator' },
        {
          label: 'Quit HRKVoice',
          click: () => {
            (app as any).isQuitting = true;
            app.quit();
          }
        }
      ]);

      this.tray?.setContextMenu(contextMenu);
    };

    updateContextMenu();

    this.tray.on('double-click', () => {
      windows.showMainWindow();
    });

    return this.tray;
  }

  public updateLanguage(langName: string): void {
    if (this.tray) {
      this.tray.setToolTip(`HRKVoice (${langName})`);
    }
  }

  public destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
  }
}
