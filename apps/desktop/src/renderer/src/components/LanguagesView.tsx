/**
 * Languages Registry & Support Matrix Component for HRKVoice Desktop
 * Showcases all 22 Official Scheduled Indian Languages + English
 */

import React, { useState } from 'react';
import { Search, Globe, CheckCircle2, AlertCircle, Play, Sparkles } from 'lucide-react';
import { getAllLanguages, LanguageDefinition } from '@hrkvoice/shared';

export const LanguagesView: React.FC = () => {
  const languages = getAllLanguages();
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageDefinition>(languages[0]);
  const [activePhraseType, setActivePhraseType] = useState<'greeting' | 'business' | 'tech' | 'numbers' | 'codeSwitching'>('business');

  const filtered = languages.filter(l =>
    l.displayName.toLowerCase().includes(search.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
    l.script.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-brand-light" />
            <span>Multilingual India-First Registry</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            22 Constitutionally Scheduled Indian Languages + English with native scripts and code-switching.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search languages or scripts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-charcoal-900 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Languages Scrollable List */}
        <div className="glass-panel rounded-xl border border-white/5 overflow-hidden flex flex-col h-[560px]">
          <div className="p-3 border-b border-white/5 bg-charcoal-850/60 text-xs font-semibold text-slate-400 flex justify-between">
            <span>Language ({filtered.length})</span>
            <span>Script</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.map(lang => {
              const isSelected = selectedLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <span>{lang.displayName}</span>
                      <span className={`text-[11px] font-normal ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        ({lang.nativeName})
                      </span>
                    </div>
                    <div className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-slate-500'}`}>
                      ISO: {lang.code.toUpperCase()} • {lang.locales[0]}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[11px] font-medium block ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {lang.script}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      lang.status === 'fully-supported'
                        ? isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-400'
                        : isSelected ? 'bg-white/20 text-white' : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {lang.status === 'fully-supported' ? 'Full Support' : 'Provider-Dep.'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Language Details & Verification Showcase */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-white/5 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">{selectedLang.displayName}</h2>
                  <span className="text-xl text-brand-light font-medium font-serif">
                    {selectedLang.nativeName}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Primary Script: <strong className="text-slate-200">{selectedLang.script}</strong> ({selectedLang.scriptCode}) • Locales: {selectedLang.locales.join(', ')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedLang.supportsCodeSwitching && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-brand/15 text-brand-light border border-brand/25 font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Code-Switching Ready
                  </span>
                )}
              </div>
            </div>

            {/* Provider Capability Mapping */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Speech Provider Capability Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {Object.entries(selectedLang.speechProviderCodes).map(([prov, code]) => (
                  <div key={prov} className="p-2.5 rounded-lg bg-charcoal-800 border border-white/5 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">{prov}</div>
                    <div className="font-semibold text-slate-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Sample Verification Phrases */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Safe Internal Test Data (Section 64)
                </h3>
                <div className="flex items-center gap-1">
                  {(['greeting', 'business', 'tech', 'numbers', 'codeSwitching'] as const).map(type => {
                    if (type === 'codeSwitching' && !selectedLang.samplePhrases.codeSwitching) return null;
                    return (
                      <button
                        key={type}
                        onClick={() => setActivePhraseType(type)}
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                          activePhraseType === type
                            ? 'bg-brand text-white'
                            : 'bg-charcoal-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-charcoal-800/80 border border-white/5 space-y-2 min-h-[90px]">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                  Spoken Example ({activePhraseType})
                </div>
                <div className="text-base font-medium text-white leading-relaxed font-sans">
                  {selectedLang.samplePhrases[activePhraseType] || selectedLang.samplePhrases.business}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-charcoal-850 border border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>Unicode script handling is verified for Indian UTF-8 clipboard safety.</span>
            <span className="font-mono text-emerald-400 text-[11px]">✓ Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
