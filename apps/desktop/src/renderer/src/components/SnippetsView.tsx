/**
 * Reusable Snippets Component for HRKVoice Desktop
 */

import React, { useState } from 'react';
import { Plus, Trash2, FileCode2 } from 'lucide-react';
import { useHrkVoice } from '../hooks/useHrkVoice';

export const SnippetsView: React.FC = () => {
  const { snippets, addSnippet, toggleSnippet, deleteSnippet } = useHrkVoice();
  const [showAdd, setShowAdd] = useState(false);
  const [trigger, setTrigger] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger || !content) return;
    await addSnippet({
      trigger: trigger.trim().toLowerCase(),
      title: title.trim() || trigger,
      content: content.trim(),
      category,
      enabled: true
    });
    setTrigger('');
    setTitle('');
    setContent('');
    setShowAdd(false);
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-brand-light" />
            <span>Voice Snippets & Templates</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Say a short spoken phrase to instantly expand large templates, email signatures, or boilerplate.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-xs font-semibold text-white shadow-md shadow-brand/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Snippet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {snippets.map(snip => (
          <div
            key={snip.id}
            className="glass-panel p-5 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{snip.title}</span>
                <button
                  onClick={() => toggleSnippet(snip.id)}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    snip.enabled
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-slate-700/30 text-slate-500'
                  }`}
                >
                  {snip.enabled ? 'Active' : 'Disabled'}
                </button>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <span>Spoken Trigger:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-charcoal-800 border border-white/10 text-brand-light font-mono">
                  "{snip.trigger}"
                </kbd>
              </div>

              <div className="p-3 rounded-lg bg-charcoal-850/80 border border-white/5 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-28 overflow-y-auto">
                {snip.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
              <span className="capitalize">{snip.category}</span>
              <button
                onClick={() => deleteSnippet(snip.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 bg-charcoal-900 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Create Voice Snippet</h2>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Spoken Trigger Phrase</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. my email or meeting intro"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Snippet Title</label>
                <input
                  type="text"
                  placeholder="e.g. Work Email Signature"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Expanded Text Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter full template..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 rounded-lg bg-charcoal-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white font-semibold shadow-md shadow-brand/25"
                >
                  Save Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
