/**
 * Dashboard Overview Component for HRKVoice Desktop
 */

import React from 'react';
import { Clock, MessageSquare, Zap, Globe2, ArrowRight, Mic, Sparkles } from 'lucide-react';
import { UsageStatistics, AppSettings } from '@hrkvoice/shared';

interface DashboardProps {
  usage: UsageStatistics;
  settings: AppSettings;
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ usage, settings, onNavigate }) => {
  const statCards = [
    {
      title: 'Estimated Time Saved',
      value: `${usage.estimatedMinutesSaved || 0}m`,
      subtitle: 'Compared to typing at 40 WPM',
      icon: Zap,
      color: 'from-amber-500/20 to-amber-700/5 text-amber-400 border-amber-500/20'
    },
    {
      title: 'Minutes Dictated',
      value: `${usage.totalMinutesDictated || 0}m`,
      subtitle: `${usage.totalSessions || 0} total voice sessions`,
      icon: Clock,
      color: 'from-brand/20 to-brand/5 text-brand-light border-brand/20'
    },
    {
      title: 'Words Dictated',
      value: (usage.totalWordsDictated || 0).toLocaleString(),
      subtitle: 'Across active applications',
      icon: MessageSquare,
      color: 'from-cyan-500/20 to-cyan-700/5 text-cyan-400 border-cyan-500/20'
    },
    {
      title: 'Indian Languages',
      value: Object.keys(usage.languageDistribution || {}).length || 1,
      subtitle: '23 full Indian languages supported',
      icon: Globe2,
      color: 'from-emerald-500/20 to-emerald-700/5 text-emerald-400 border-emerald-500/20'
    }
  ];

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-charcoal-900 via-charcoal-850 to-charcoal-900 border border-white/10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-xs font-semibold text-brand-light">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Voice Productivity</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Speak Naturally. Write Instantly.
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            HRKVoice understands your natural Indian multilingual speech, Hinglish code-switching, and technical vocabulary — formatting and inserting clean text into any active app on your PC.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => onNavigate('scratchpad')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand hover:bg-brand-hover text-white font-medium text-sm transition-all shadow-lg shadow-brand/25"
            >
              <Mic className="w-4 h-4" />
              <span>Launch Live Scratchpad</span>
            </button>
            <button
              onClick={() => onNavigate('languages')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 font-medium text-sm transition-all border border-white/10"
            >
              <span>Explore 23 Languages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-xl border bg-gradient-to-br ${card.color} backdrop-blur-sm space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.title}
                </span>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </div>
              <div className="text-[11px] text-slate-400">
                {card.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Engine Card */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Active Engine Configuration</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <span className="text-slate-400">Speech-To-Text Provider</span>
              <span className="font-mono font-semibold text-slate-200 capitalize">
                {settings.speechProvider} {settings.speechProvider === 'mock' ? '(Offline Demo)' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <span className="text-slate-400">AI Cleanup & Formatting Engine</span>
              <span className="font-mono font-semibold text-slate-200 capitalize">
                {settings.aiProvider} {settings.aiProvider === 'mock' ? '(Local NLP)' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <span className="text-slate-400">Default Writing Mode</span>
              <span className="font-mono font-semibold text-brand-light capitalize">
                {settings.activeWritingMode}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <span className="text-slate-400">Auto-Paste to Active Window</span>
              <span className={`font-mono font-semibold ${settings.autoPaste ? 'text-emerald-400' : 'text-slate-500'}`}>
                {settings.autoPaste ? 'Enabled (Ctrl+V)' : 'Disabled'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs text-brand-light hover:text-white font-medium transition-colors"
          >
            Configure Providers & API Keys →
          </button>
        </div>

        {/* Global Shortcut Quick Card */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
          <h2 className="text-base font-bold text-white">How To Use Anywhere</h2>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand/20 text-brand-light font-bold flex items-center justify-center text-[10px]">
                1
              </span>
              <p>Focus any text field in Chrome, VS Code, Slack, WhatsApp, Word, or Terminal.</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand/20 text-brand-light font-bold flex items-center justify-center text-[10px]">
                2
              </span>
              <p>
                Press <kbd className="px-1.5 py-0.5 rounded bg-charcoal-900 border border-white/10 text-white font-mono text-[10px]">{settings.pushToTalkShortcut}</kbd> and speak naturally in English, Hindi, Gujarati, or any Indian language.
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand/20 text-brand-light font-bold flex items-center justify-center text-[10px]">
                3
              </span>
              <p>Release shortcut — HRKVoice cleans self-corrections and inserts polished text directly!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
