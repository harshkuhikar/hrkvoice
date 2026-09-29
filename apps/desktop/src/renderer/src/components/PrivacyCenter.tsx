/**
 * Privacy Center Component for HRKVoice Desktop
 */

import React from 'react';
import { ShieldCheck, Lock, HardDrive, EyeOff, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useHrkVoice } from '../hooks/useHrkVoice';

export const PrivacyCenter: React.FC = () => {
  const { settings, updateSettings, clearHistory } = useHrkVoice();

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-brand-light" />
          <span>Privacy Center & Data Controls</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          HRKVoice is architected from the ground up for strict privacy, zero raw audio storage, and encrypted local data.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-3 bg-charcoal-900">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white">Zero Raw Audio Storage</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Audio buffers exist exclusively in volatile memory during transcription and are immediately discarded. No audio is ever written to disk.
          </p>
          <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Enforced by Architecture
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-3 bg-charcoal-900">
          <div className="w-8 h-8 rounded-lg bg-brand/15 text-brand-light flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white">Encrypted Local Vault</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            API keys and local settings are secured using AES-256-GCM encryption with PBKDF2 machine-level key derivation.
          </p>
          <div className="text-[11px] font-semibold text-brand-light flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> AES-256-GCM Active
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-3 bg-charcoal-900">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white">Full User Data Control</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Disable transcription history or wipe your local records anytime. You retain complete ownership of all personal dictionary entries.
          </p>
          <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% User Owned
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4 text-xs">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Granular Privacy Toggles</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
            <div>
              <div className="font-semibold text-slate-200">Retain Local Transcription History</div>
              <div className="text-slate-400 text-[11px]">When disabled, transcripts are never written to disk.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.retainHistory}
              onChange={(e) => updateSettings({ retainHistory: e.target.checked })}
              className="w-4 h-4 rounded accent-brand"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
            <div>
              <div className="font-semibold text-slate-200">Context Window Titles</div>
              <div className="text-slate-400 text-[11px]">Allow HRKVoice to inspect the active browser tab or window title for mode selection.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.collectWindowTitle}
              onChange={(e) => updateSettings({ collectWindowTitle: e.target.checked })}
              className="w-4 h-4 rounded accent-brand"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
            <div>
              <div className="font-semibold text-slate-200">Anonymous Telemetry</div>
              <div className="text-slate-400 text-[11px]">Only event counters (e.g. dictation_started), never audio or transcripts.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.analyticsEnabled}
              onChange={(e) => updateSettings({ analyticsEnabled: e.target.checked })}
              className="w-4 h-4 rounded accent-brand"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Purge Local History</span>
            </div>
            <div className="text-slate-400 text-[11px]">Permanently erase all local dictation logs from your device.</div>
          </div>
          <button
            onClick={() => {
              if (confirm('Permanently wipe all transcription history from this computer?')) {
                clearHistory();
                alert('History purged.');
              }
            }}
            className="px-3.5 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 font-semibold"
          >
            Purge All Data
          </button>
        </div>
      </div>
    </div>
  );
};
