/**
 * Preload Script for HRKVoice Desktop
 * Securely bridges native Electron APIs to React Renderer
 */

import { contextBridge, ipcRenderer } from 'electron';

export interface HrkVoiceBridge {
  platform: string;
  isElectron: boolean;
  insertText: (text: string, options?: { restoreClipboard?: boolean; restoreDelayMs?: number }) => Promise<{ success: boolean; method: string; error?: string }>;
  copyText: (text: string) => Promise<boolean>;
  getContext: (options: { enabled: boolean; collectWindowTitle: boolean }) => Promise<any>;
  showFloatingBar: () => Promise<void>;
  hideFloatingBar: () => Promise<void>;
  showMainWindow: (targetView?: string, text?: string) => Promise<void>;
  syncRecordingState: (payload: { isRecording: boolean; state: string; language: string; mode: string }) => void;
  syncAudioLevel: (level: number) => void;
  onRecordingState: (callback: (payload: any) => void) => () => void;
  onAudioLevel: (callback: (level: number) => void) => () => void;
  onShortcutRecordingToggled: (callback: (isRecording: boolean) => void) => () => void;
  onShortcutRecordingCancelled: (callback: () => void) => () => void;
  onTriggerRecordingToggle: (callback: () => void) => () => void;
  onNavigateTo: (callback: (view: string) => void) => () => void;
  onDictationCompleted: (callback: (data: { view: string; text: string }) => void) => () => void;
}

const api: HrkVoiceBridge = {
  platform: process.platform,
  isElectron: true,

  insertText: (text, options) => ipcRenderer.invoke('hrkvoice:insert-text', text, options),
  copyText: (text) => ipcRenderer.invoke('hrkvoice:copy-text', text),
  getContext: (options) => ipcRenderer.invoke('hrkvoice:get-context', options),
  showFloatingBar: () => ipcRenderer.invoke('hrkvoice:show-floating-bar'),
  hideFloatingBar: () => ipcRenderer.invoke('hrkvoice:hide-floating-bar'),
  showMainWindow: (targetView?: string, text?: string) => ipcRenderer.invoke('hrkvoice:show-main-window', targetView, text),

  syncRecordingState: (payload) => ipcRenderer.send('hrkvoice:sync-recording-state', payload),
  syncAudioLevel: (level) => ipcRenderer.send('hrkvoice:sync-audio-level', level),

  onRecordingState: (callback) => {
    const subscription = (_: any, data: any) => callback(data);
    ipcRenderer.on('hrkvoice:on-recording-state', subscription);
    return () => ipcRenderer.removeListener('hrkvoice:on-recording-state', subscription);
  },

  onAudioLevel: (callback) => {
    const subscription = (_: any, level: number) => callback(level);
    ipcRenderer.on('hrkvoice:on-audio-level', subscription);
    return () => ipcRenderer.removeListener('hrkvoice:on-audio-level', subscription);
  },

  onShortcutRecordingToggled: (callback) => {
    const subscription = (_: any, isRec: boolean) => callback(isRec);
    ipcRenderer.on('hrkvoice:shortcut-recording-toggled', subscription);
    return () => ipcRenderer.removeListener('hrkvoice:shortcut-recording-toggled', subscription);
  },

  onShortcutRecordingCancelled: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('hrkvoice:shortcut-recording-cancelled', subscription);
    return () => ipcRenderer.removeListener('hrkvoice:shortcut-recording-cancelled', subscription);
  },

  onTriggerRecordingToggle: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on('hrkvoice:trigger-recording-toggle', subscription);
    return () => ipcRenderer.removeListener('hrkvoice:trigger-recording-toggle', subscription);
  },

  onNavigateTo: (callback) => {
    const subscription = (_: any, view: string) => callback(view);
    ipcRenderer.on('navigate-to', subscription);
    return () => ipcRenderer.removeListener('navigate-to', subscription);
  },

  onDictationCompleted: (callback) => {
    const subscription = (_: any, data: { view: string; text: string }) => callback(data);
    ipcRenderer.on('hrkvoice:dictation-completed', subscription);
    return () => ipcRenderer.removeListener('hrkvoice:dictation-completed', subscription);
  }
};

contextBridge.exposeInMainWorld('hrkVoice', api);
