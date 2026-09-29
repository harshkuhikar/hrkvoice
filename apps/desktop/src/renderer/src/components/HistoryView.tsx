/**
 * History & Transcripts Log Component for HRKVoice Desktop
 */

import React, { useState } from 'react';
import { Search, Download, Trash2, Copy, Check, History, Sparkles } from 'lucide-react';
import { useHrkVoice } from '../hooks/useHrkVoice';

export const HistoryView: React.FC = () => {
  const { history, deleteHistoryItem, clearHistory } = useHrkVoice();
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = history.filter(h => {
    if (selectedLang !== 'all' && h.sourceLanguage !== selectedLang) return false;
    if (!search) return true;
    return (
      h.processedText.toLowerCase().includes(search.toLowerCase()) ||
      h.rawTranscript.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExport = (format: 'json' | 'csv' | 'txt') => {
    window.open(`http://localhost:4321/api/history/export?format=${format}`, '_blank');
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-brand-light" />
            <span>Transcription History</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Search, copy, or export past dictations. Raw audio is never saved.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('json')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs font-medium text-slate-300 border border-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs font-medium text-slate-300 border border-white/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all transcription history?')) clearHistory();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-400 border border-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transcripts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand"
          />
        </div>

        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="bg-charcoal-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="gu">Gujarati</option>
          <option value="bn">Bengali</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
        </select>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-white/5 space-y-2">
            <p className="text-sm text-slate-400">No transcripts recorded yet.</p>
            <p className="text-xs text-slate-500">Dictations will appear here when you use HRKVoice.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className="glass-panel p-5 rounded-xl border border-white/5 space-y-3 hover:border-white/15 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-brand/15 text-brand-light font-bold text-[10px] uppercase">
                    {item.mode}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {item.sourceLanguage.toUpperCase()}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item.id, item.processedText)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-300 border border-white/5 transition-all"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text Body */}
              <div className="text-sm text-white leading-relaxed font-sans whitespace-pre-wrap">
                {item.processedText}
              </div>

              {/* Raw Transcript Collapsible preview */}
              {item.rawTranscript && item.rawTranscript !== item.processedText && (
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                  <span className="text-slate-500">Raw Spoken: </span>
                  <span className="italic">"{item.rawTranscript}"</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
