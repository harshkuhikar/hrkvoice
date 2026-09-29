/**
 * Main Application State and API Hook for HRKVoice Renderer
 */

import { useState, useEffect, useCallback } from 'react';
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  DictionaryEntry,
  Snippet,
  TranscriptionHistoryItem,
  UsageStatistics,
  LanguageDefinition,
  getAllLanguages
} from '@hrkvoice/shared';

const API_BASE = 'http://localhost:4321/api';

export function useHrkVoice() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [languages, setLanguages] = useState<LanguageDefinition[]>(getAllLanguages());
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [history, setHistory] = useState<TranscriptionHistoryItem[]>([]);
  const [usage, setUsage] = useState<UsageStatistics>({
    totalMinutesDictated: 0,
    totalWordsDictated: 0,
    totalSessions: 0,
    estimatedMinutesSaved: 0,
    languageDistribution: {},
    modeDistribution: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<string>('dashboard');

  const fetchAll = useCallback(async () => {
    try {
      const [setRes, dictRes, snipRes, histRes, useRes] = await Promise.all([
        fetch(`${API_BASE}/settings`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/dictionary`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/snippets`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/history`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE}/usage`).then(r => r.json()).catch(() => null)
      ]);

      if (setRes?.success && setRes.settings) {
        setSettings(setRes.settings);
      }
      if (dictRes?.success && dictRes.entries) {
        setDictionary(dictRes.entries);
      }
      if (snipRes?.success && snipRes.snippets) {
        setSnippets(snipRes.snippets);
      }
      if (histRes?.success && histRes.history) {
        setHistory(histRes.history);
      }
      if (useRes?.success && useRes.usage) {
        setUsage(useRes.usage);
      }
    } catch (err) {
      console.warn('[useHrkVoice] Error connecting to local backend API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(prev => ({ ...prev, ...updates }));
      }
    } catch (err) {
      console.error('[useHrkVoice] Failed to update settings:', err);
    }
  };

  const addDictionaryEntry = async (entry: Omit<DictionaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_BASE}/dictionary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      const data = await res.json();
      if (data.success) {
        setDictionary(prev => [data.entry, ...prev]);
      }
      return data.entry;
    } catch (err) {
      console.error('[useHrkVoice] Failed to add dictionary entry:', err);
    }
  };

  const toggleDictionaryEntry = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/dictionary/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setDictionary(prev => prev.map(d => (d.id === id ? data.entry : d)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDictionaryEntry = async (id: string) => {
    try {
      await fetch(`${API_BASE}/dictionary/${id}`, { method: 'DELETE' });
      setDictionary(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const addSnippet = async (snip: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch(`${API_BASE}/snippets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snip)
      });
      const data = await res.json();
      if (data.success) {
        setSnippets(prev => [data.snippet, ...prev]);
      }
      return data.snippet;
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSnippet = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/snippets/${id}/toggle`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSnippets(prev => prev.map(s => (s.id === id ? data.snippet : s)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      await fetch(`${API_BASE}/snippets/${id}`, { method: 'DELETE' });
      setSnippets(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const clearHistory = async () => {
    try {
      await fetch(`${API_BASE}/history`, { method: 'DELETE' });
      setHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const processAudio = async (
    audioBase64: string,
    options?: { language?: string; mode?: string; transcript?: string }
  ) => {
    let context = { activeApp: 'HRKVoice Scratchpad', windowTitle: '' };
    if (window.hrkVoice?.getContext) {
      try {
        context = await window.hrkVoice.getContext({
          enabled: settings.enableContextAwareness,
          collectWindowTitle: settings.collectWindowTitle
        });
      } catch {}
    }

    const res = await fetch(`${API_BASE}/transcription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64,
        transcript: options?.transcript,
        language: options?.language || settings.defaultInputLanguage,
        mode: options?.mode || settings.activeWritingMode,
        context
      })
    });
    const data = await res.json();
    if (data.success) {
      fetchAll(); // Refresh history and stats
      return data.result;
    }
    throw new Error(data.error?.message || 'Transcription failed');
  };

  const processText = async (text: string, options?: { language?: string; mode?: string }) => {
    const res = await fetch(`${API_BASE}/ai/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        sourceLanguage: options?.language || settings.defaultInputLanguage,
        mode: options?.mode || settings.activeWritingMode
      })
    });
    const data = await res.json();
    if (data.success) return data.result;
    throw new Error(data.error || 'AI processing failed');
  };

  const rewriteText = async (text: string, instruction: any) => {
    const res = await fetch(`${API_BASE}/ai/rewrite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, instruction })
    });
    const data = await res.json();
    if (data.success) return data.rewritten;
    return text;
  };

  const insertText = async (text: string) => {
    if (window.hrkVoice?.insertText) {
      return await window.hrkVoice.insertText(text, {
        restoreClipboard: settings.restoreClipboard,
        restoreDelayMs: settings.clipboardRestoreDelayMs
      });
    } else {
      // Browser fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'browser-clipboard' };
    }
  };

  return {
    settings,
    languages,
    dictionary,
    snippets,
    history,
    usage,
    isLoading,
    activeView,
    setActiveView,
    updateSettings,
    addDictionaryEntry,
    toggleDictionaryEntry,
    deleteDictionaryEntry,
    addSnippet,
    toggleSnippet,
    deleteSnippet,
    clearHistory,
    deleteHistoryItem,
    processAudio,
    processText,
    rewriteText,
    insertText,
    refreshData: fetchAll
  };
}
