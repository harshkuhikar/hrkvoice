/**
 * Sidebar Navigation for HRKVoice Desktop Dashboard
 */

import React from 'react';
import {
  LayoutDashboard,
  Mic,
  Languages,
  Layers,
  BookA,
  FileCode2,
  History,
  Settings,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { AppSettings } from '@hrkvoice/shared';

interface NavbarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  settings: AppSettings;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onSelectView, settings }) => {
  const isDemo = settings.speechProvider === 'mock' || settings.aiProvider === 'mock';

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'scratchpad', label: 'Live Scratchpad', icon: Mic, highlight: true },
    { id: 'languages', label: 'Languages (23)', icon: Languages },
    { id: 'modes', label: 'Writing Modes', icon: Layers },
    { id: 'dictionary', label: 'Dictionary', icon: BookA },
    { id: 'snippets', label: 'Snippets', icon: FileCode2 },
    { id: 'history', label: 'History', icon: History },
    { id: 'privacy', label: 'Privacy Center', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-charcoal-900 border-r border-white/5 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-indigo-700 flex items-center justify-center shadow-lg shadow-brand/25 text-white font-mono font-bold text-sm tracking-wider">
            HRK
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>HRKVoice</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">India-First Voice AI</div>
          </div>
        </div>

        {/* Demo Mode / Cloud Indicator */}
        {isDemo ? (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Demo
          </span>
        ) : (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse" /> Live
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-brand-light' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Global Shortcut Footnote */}
      <div className="p-4 border-t border-white/5 bg-charcoal-950/40">
        <div className="text-[11px] text-slate-400 font-medium mb-1">Global Push-to-Talk</div>
        <kbd className="inline-block px-2 py-1 rounded bg-charcoal-800 border border-white/10 text-[11px] font-mono text-slate-200">
          {settings.pushToTalkShortcut}
        </kbd>
      </div>
    </aside>
  );
};
