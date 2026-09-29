/**
 * Window Management for HRKVoice Desktop
 * Manages Dashboard Window and Floating Recording Pill
 */

import { BrowserWindow, screen, app } from 'electron';
import path from 'path';

export class WindowManager {
  private mainWindow: BrowserWindow | null = null;
  private floatingBarWindow: BrowserWindow | null = null;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  public getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  public getFloatingBarWindow(): BrowserWindow | null {
    return this.floatingBarWindow;
  }

  public createMainWindow(): BrowserWindow {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.show();
      this.mainWindow.focus();
      return this.mainWindow;
    }

    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

    this.mainWindow = new BrowserWindow({
      width: Math.min(1180, screenWidth - 100),
      height: Math.min(800, screenHeight - 80),
      minWidth: 920,
      minHeight: 620,
      backgroundColor: '#0d0f14',
      show: false,
      title: 'HRKVoice - India-First Voice Productivity',
      frame: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false
      }
    });

    if (this.isDevelopment) {
      this.mainWindow.loadURL('http://localhost:5173');
    } else {
      this.mainWindow.loadFile(path.resolve(__dirname, '../../dist/index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('close', (event) => {
      // Hide to tray rather than quit
      if (!(app as any).isQuitting) {
        event.preventDefault();
        this.mainWindow?.hide();
      }
    });

    return this.mainWindow;
  }

  public createFloatingBarWindow(): BrowserWindow {
    if (this.floatingBarWindow && !this.floatingBarWindow.isDestroyed()) {
      return this.floatingBarWindow;
    }

    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth } = primaryDisplay.workAreaSize;

    const barWidth = 420;
    const barHeight = 84;
    const posX = Math.round((screenWidth - barWidth) / 2);
    const posY = 35; // Top-center position

    this.floatingBarWindow = new BrowserWindow({
      width: barWidth,
      height: barHeight,
      x: posX,
      y: posY,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      hasShadow: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js'),
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: false
      }
    });

    if (this.isDevelopment) {
      this.floatingBarWindow.loadURL('http://localhost:5173#floating-bar');
    } else {
      this.floatingBarWindow.loadFile(path.resolve(__dirname, '../../dist/index.html'), {
        hash: 'floating-bar'
      });
    }

    return this.floatingBarWindow;
  }

  public showFloatingBar(): void {
    if (!this.floatingBarWindow || this.floatingBarWindow.isDestroyed()) {
      this.createFloatingBarWindow();
    }
    this.floatingBarWindow?.showInactive();
  }

  public hideFloatingBar(): void {
    if (this.floatingBarWindow && !this.floatingBarWindow.isDestroyed()) {
      this.floatingBarWindow.hide();
    }
  }
}
