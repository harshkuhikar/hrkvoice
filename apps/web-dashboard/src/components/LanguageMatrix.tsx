/**
 * Language Matrix Showcase for HRKVoice Landing Page
 */

import React from 'react';
import { getAllLanguages } from '@hrkvoice/shared';

export const LanguageMatrix: React.FC = () => {
  const languages = getAllLanguages();

  return (
    <section id="languages" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          23 Languages. Endless Productivity.
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          From Hindi and Gujarati to Bengali, Tamil, Telugu, and Sanskrit — HRKVoice preserves authentic regional scripts and natural speech.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {languages.map(lang => (
          <div
            key={lang.code}
            className="p-4 rounded-xl bg-charcoal-900 border border-white/5 hover:border-brand/40 transition-all text-center space-y-1"
          >
            <div className="text-lg font-bold text-white">{lang.displayName}</div>
            <div className="text-xs text-brand-light font-serif">{lang.nativeName}</div>
            <div className="text-[10px] text-slate-500 font-mono pt-1">
              {lang.script} • {lang.code.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
