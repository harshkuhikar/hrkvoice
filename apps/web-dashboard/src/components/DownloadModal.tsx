/**
 * Download & Windows Setup Modal for HRKVoice
 * Delivers direct Windows installer & portable download links with setup instructions
 */

import React, { useState } from 'react';
import {
  Download,
  X,
  Check,
  Laptop,
  ShieldCheck,
  Zap,
  Terminal,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'installer' | 'portable'>('installer');

  if (!isOpen) return null;

  const handleDownload = (format: 'installer' | 'portable') => {
    setSelectedFormat(format);
    setDownloadStarted(true);

    const link = document.createElement('a');
    if (format === 'installer') {
      link.href = '/HRKVoice-Windows-x64.zip';
      link.download = 'HRKVoice-Windows-x64.zip';
    } else {
      link.href = '/HRKVoice.exe';
      link.download = 'HRKVoice.exe';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-brand/20 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/5 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand/15 text-brand-light text-[11px] font-semibold">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Official Windows Release v1.0.0</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Download HRKVoice for Windows
            </h3>
            <p className="text-xs text-slate-400">
              Compatible with Windows 10 & 11 (64-bit) • No cloud subscription required
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Download Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Windows Setup Installer */}
          <div
            onClick={() => handleDownload('installer')}
            className="p-5 rounded-2xl bg-charcoal-950/80 border border-brand/40 hover:border-brand transition-all cursor-pointer space-y-3 group hover:shadow-xl hover:shadow-brand/10 relative"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-brand/20 text-brand-light flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-brand text-white text-[10px] font-bold">
                Recommended
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-light transition-colors">
                Windows Setup Installer
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Full desktop installer with automatic background launch and system tray integration.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-semibold text-brand-light">
              <span>HRKVoice-Windows-x64.zip (119 MB)</span>
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>

          {/* Portable Executable */}
          <div
            onClick={() => handleDownload('portable')}
            className="p-5 rounded-2xl bg-charcoal-950/80 border border-white/10 hover:border-white/20 transition-all cursor-pointer space-y-3 group hover:shadow-xl relative"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-[10px] font-semibold">
                Direct PE
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-brand-light transition-colors">
                Standalone Executable (.exe)
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Single Windows 64-bit binary file. Place in any directory and run directly.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>HRKVoice.exe (188 MB)</span>
              <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Download Success Notice */}
        {downloadStarted && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="font-semibold">Download started!</span> Extract the ZIP and run <strong>HRKVoice.exe</strong> to start using voice dictation on Windows.
            </div>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="p-4 rounded-2xl bg-charcoal-950/60 border border-white/5 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            How to Run in 3 Simple Steps:
          </h4>
          <ol className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand-light font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                1
              </span>
              <span>
                <strong>Extract & Launch:</strong> Extract the downloaded <code className="text-brand-light font-mono">HRKVoice-Windows-x64.zip</code> and double-click <strong>HRKVoice.exe</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand-light font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                2
              </span>
              <span>
                <strong>System Tray:</strong> HRKVoice starts ready in your Windows system tray near the clock.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand-light font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                3
              </span>
              <span>
                <strong>Global Shortcut:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-charcoal-800 border border-white/20 text-white font-mono text-[10px]">Ctrl + Alt + Space</kbd> anywhere in any application (WhatsApp, Word, VS Code, Browser) to dictate in Gujarati or Hindi!
              </span>
            </li>
          </ol>
        </div>

        {/* Security & System Specs */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Virus-Free & Safe • Signed Windows Binary</span>
          </div>
          <span>RAM: &lt;150MB • Windows 10/11 64-bit</span>
        </div>
      </div>
    </div>
  );
};
