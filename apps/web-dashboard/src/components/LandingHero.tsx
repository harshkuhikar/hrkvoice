/**
 * Landing Page Hero Component for HRKVoice
 */

import React from 'react';
import { Download, Sparkles, ArrowRight, Play, Shield, Globe2, Terminal, Mic } from 'lucide-react';

export const LandingHero: React.FC<{ onTryDemo: () => void; onDownloadClick: () => void }> = ({
  onTryDemo,
  onDownloadClick
}) => {
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden max-w-7xl mx-auto text-center">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-xs font-semibold text-brand-light shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India-First Multilingual AI Voice Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
          Speak Naturally. <br />
          <span className="bg-gradient-to-r from-brand-light via-indigo-300 to-white bg-clip-text text-transparent">
            Write Instantly.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          HRKVoice turns your natural speech into clean, context-aware text across your computer. Built specifically for Indian accents, regional languages, Hinglish code-switching, and developer workflows.
        </p>

        {/* Call to Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onTryDemo}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-sm shadow-xl shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5 transition-all ring-2 ring-brand-light/30"
          >
            <Mic className="w-4 h-4 text-white" />
            <span>Try Live Voice Studio</span>
          </button>

          <button
            onClick={onDownloadClick}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-slate-200 border border-white/10 font-semibold text-sm hover:-translate-y-0.5 transition-all shadow-lg"
          >
            <Download className="w-4 h-4 text-brand-light" />
            <span>Download for Windows (64-bit)</span>
          </button>
        </div>

        {/* Key Trust Signals */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-4 h-4 text-brand-light" /> 23 Indian Languages
          </span>
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-cyan-400" /> Developer Mode Ready
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400" /> Zero Raw Audio Retention
          </span>
        </div>
      </div>
    </section>
  );
};
