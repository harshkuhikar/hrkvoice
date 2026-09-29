/**
 * Personal Dictionary & Domain Vocabulary Component for HRKVoice Desktop
 */

import React, { useState } from 'react';
import { Plus, Search, Download, Upload, Trash2, CheckCircle2, XCircle, BookA } from 'lucide-react';
import { useHrkVoice } from '../hooks/useHrkVoice';
import { DictionaryCategory } from '@hrkvoice/shared';

export const DictionaryView: React.FC = () => {
  const { dictionary, addDictionaryEntry, toggleDictionaryEntry, deleteDictionaryEntry } = useHrkVoice();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [word, setWord] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [preferredSpelling, setPreferredSpelling] = useState('');
  const [category, setCategory] = useState<DictionaryCategory>('personal');
  const [language, setLanguage] = useState('all');

  const filtered = dictionary.filter(d =>
    d.word.toLowerCase().includes(search.toLowerCase()) ||
    d.preferredSpelling.toLowerCase().includes(search.toLowerCase()) ||
    (d.pronunciation && d.pronunciation.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !preferredSpelling) return;
    await addDictionaryEntry({
      word: word.trim(),
      pronunciation: pronunciation.trim() || undefined,
      preferredSpelling: preferredSpelling.trim(),
      category,
      language,
      enabled: true
    });
    setWord('');
    setPronunciation('');
    setPreferredSpelling('');
    setShowAddModal(false);
  };

  const handleExport = () => {
    const json = JSON.stringify(dictionary, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hrkvoice-dictionary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookA className="w-6 h-6 text-brand-light" />
            <span>Personal & Domain Dictionary</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Ensure company names, regional terms, and technical keywords are always recognized and spelled correctly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs font-medium text-slate-300 border border-white/10 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-xs font-semibold text-white shadow-md shadow-brand/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Term</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search vocabulary..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-charcoal-900 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand"
        />
      </div>

      {/* Terms Table */}
      <div className="glass-panel rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-charcoal-850/60 border-b border-white/5 text-slate-400 uppercase font-mono text-[10px]">
            <tr>
              <th className="p-3.5">Spoken Word</th>
              <th className="p-3.5">Pronunciation Guide</th>
              <th className="p-3.5">Preferred Output</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No vocabulary terms found.
                </td>
              </tr>
            ) : (
              filtered.map(entry => (
                <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-bold text-white">{entry.word}</td>
                  <td className="p-3.5 text-slate-400 font-mono">{entry.pronunciation || '—'}</td>
                  <td className="p-3.5 font-bold text-brand-light">{entry.preferredSpelling}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-charcoal-800 border border-white/5 text-[10px] text-slate-300 capitalize">
                      {entry.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => toggleDictionaryEntry(entry.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        entry.enabled
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-slate-700/30 text-slate-500 border border-white/5'
                      }`}
                    >
                      {entry.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => deleteDictionaryEntry(entry.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Term Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 bg-charcoal-900 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Add Personal Vocabulary Term</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Spoken Word / Misheard Term</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senaptech"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Pronunciation Guide (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sen-ap-tik"
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Preferred Replacement Spelling</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senaptiq"
                  value={preferredSpelling}
                  onChange={(e) => setPreferredSpelling(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="developer">Developer</option>
                    <option value="company">Company</option>
                    <option value="medical">Medical</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Language Scope</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                  >
                    <option value="all">All Languages</option>
                    <option value="en">English Only</option>
                    <option value="hi">Hindi Only</option>
                    <option value="gu">Gujarati Only</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-white font-semibold shadow-md shadow-brand/25"
                >
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
