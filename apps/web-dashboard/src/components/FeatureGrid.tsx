/**
 * Feature Grid Component for HRKVoice Landing Page
 */

import React from 'react';
import { Globe2, Sparkles, Terminal, ShieldCheck, Zap, BookA } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      title: 'Multilingual India-First',
      desc: '22 Constitutionally scheduled Indian languages plus English. Tuned for regional accents and authentic vernacular pronunciations.',
      icon: Globe2,
      badge: '23 Languages'
    },
    {
      title: 'Hinglish & Code-Switching',
      desc: 'Speak naturally in mixed sentences without technical terms being destroyed or awkwardly translated. React, GitHub, and Node.js remain intact.',
      icon: Sparkles,
      badge: 'Bilingual AI'
    },
    {
      title: 'Dedicated Developer Mode',
      desc: 'Dictate code components in PascalCase, React hooks in camelCase, CLI commands, and npm packages without manual syntax editing.',
      icon: Terminal,
      badge: 'Engineers'
    },
    {
      title: 'Intelligent Speech Repair',
      desc: 'Change your mind mid-sentence ("Rahul, actually Rohit") and HRKVoice seamlessly repairs the text to reflect your final intent.',
      icon: Zap,
      badge: 'Self-Correction'
    },
    {
      title: 'Personal & Company Vocabulary',
      desc: 'Add custom brand names, colleague names, portfolio companies, and medical/legal jargon to your personal dictionary.',
      icon: BookA,
      badge: 'Custom Terms'
    },
    {
      title: 'Privacy-First Architecture',
      desc: 'Zero raw audio retention. Transcripts are stored locally in an AES-256-GCM encrypted database. Your voice stays yours.',
      icon: ShieldCheck,
      badge: 'Local Vault'
    }
  ];

  return (
    <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Built for the Way India Speaks & Works
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Unlike generic English dictation tools, HRKVoice is engineered from day one for Indian multilingualism, professional code-switching, and desktop workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-brand/30 transition-all hover:-translate-y-1 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-brand/10 text-brand-light">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5">
                  {f.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
