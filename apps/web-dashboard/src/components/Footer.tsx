/**
 * Footer Component for HRKVoice Landing Page
 */

import React from 'react';
import { Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-12 px-6 max-w-7xl mx-auto text-xs text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-mono font-bold text-xs">
            HRK
          </div>
          <span className="font-bold text-sm text-white">HRKVoice</span>
          <span className="text-slate-500">— India-First Voice AI Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          <a href="#languages" className="hover:text-white transition-colors">Languages</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
        <p>© 2026 HRKVoice. Licensed under the Apache-2.0 License.</p>
        <p>Built with Electron, React, Vite, and Node.js for Windows 10/11.</p>
      </div>
    </footer>
  );
};
