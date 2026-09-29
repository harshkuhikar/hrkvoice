/**
 * Developer Mode Showcase for HRKVoice Landing Page
 */

import React from 'react';
import { Terminal, Code2, ArrowRight } from 'lucide-react';

export const DeveloperModeShowcase: React.FC = () => {
  const examples = [
    {
      spoken: 'create a component called user profile card',
      transformed: 'UserProfileCard',
      type: 'PascalCase Component'
    },
    {
      spoken: 'create a use effect hook',
      transformed: 'useEffect',
      type: 'camelCase React Hook'
    },
    {
      spoken: 'npm install react router dom',
      transformed: 'npm install react-router-dom',
      type: 'CLI Package Command'
    },
    {
      spoken: 'constant api base url',
      transformed: 'API_BASE_URL',
      type: 'UPPER_SNAKE_CASE Constant'
    }
  ];

  return (
    <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>Tailored for Software Engineers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Code Faster with Developer Mode
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          HRKVoice understands software syntax natively. Dictate inside VS Code, Cursor, or Terminal without stopping to reformat variable casing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((ex, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 bg-charcoal-900">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
              {ex.type}
            </span>
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Spoken:</div>
              <div className="text-xs text-slate-300 font-mono italic">"{ex.spoken}"</div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <ArrowRight className="w-3.5 h-3.5 text-brand-light" />
              <div className="text-sm font-mono font-bold text-white bg-charcoal-800 px-3 py-1.5 rounded-lg border border-white/10">
                {ex.transformed}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
