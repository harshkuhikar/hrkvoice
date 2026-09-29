/**
 * Writing Modes Configuration and Showcase for HRKVoice Desktop
 */

import React, { useState } from 'react';
import {
  Feather,
  Mail,
  MessageCircle,
  Briefcase,
  Coffee,
  Terminal,
  Cpu,
  FileText,
  Check,
  Sparkles
} from 'lucide-react';
import { WRITING_MODES, WritingMode } from '@hrkvoice/shared';
import { useHrkVoice } from '../hooks/useHrkVoice';

export const ModesView: React.FC = () => {
  const { settings, updateSettings } = useHrkVoice();
  const [activeTab, setActiveTab] = useState<WritingMode>(settings.activeWritingMode || 'general');

  const modeIcons: Record<string, any> = {
    general: Feather,
    email: Mail,
    chat: MessageCircle,
    professional: Briefcase,
    casual: Coffee,
    developer: Terminal,
    prompt: Cpu,
    notes: FileText
  };

  const modeExamples: Record<WritingMode, { spoken: string; output: string }> = {
    general: {
      spoken: 'hey um can you send rahul the invoice actually not rahul send it to rohit tomorrow morning',
      output: 'Hey, can you send Rohit the invoice tomorrow morning?'
    },
    email: {
      spoken: 'hi rahul just following up on the proposal can you send me the updated quotation by tomorrow',
      output: 'Hi Rahul,\n\nJust following up on the proposal. Could you please send me the updated quotation by tomorrow?\n\nThanks.'
    },
    chat: {
      spoken: 'hey rahul are you coming tomorrow',
      output: 'Hey Rahul, are you coming tomorrow?'
    },
    professional: {
      spoken: 'we gotta finalize the deal today or client might look elsewhere',
      output: 'It is imperative that we finalize this agreement today to ensure client retention and avoid project delays.'
    },
    casual: {
      spoken: 'Please find attached the financial review as discussed in our call',
      output: 'Here is the financial review we talked about earlier!'
    },
    developer: {
      spoken: 'create a component called user profile card and npm install react router dom and create a use effect hook',
      output: 'UserProfileCard\nnpm install react-router-dom\nuseEffect'
    },
    prompt: {
      spoken: 'I want to build a React website for a plant business with dark green colors and smooth animations',
      output: 'Task:\nBuild a modern responsive React web application for a plant nursery and botanical business.\n\nRequirements:\n- Color palette: Deep forest green accents with organic neutrals\n- Smooth transitions and interactive micro-animations (Framer Motion / GSAP)\n- Production-quality component architecture with clean TypeScript'
    },
    notes: {
      spoken: 'meeting takeaways first rahul will deploy the api second rohit will review test cases third client demo on friday',
      output: '• Rahul will deploy the API\n• Rohit will review test cases\n• Client demo on Friday'
    }
  };

  const handleSetActive = (modeId: WritingMode) => {
    updateSettings({ activeWritingMode: modeId });
  };

  const currentModeInfo = WRITING_MODES.find(m => m.id === activeTab) || WRITING_MODES[0];
  const Icon = modeIcons[currentModeInfo.id] || Feather;

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Writing Modes & Styles</h1>
        <p className="text-slate-400 text-sm mt-1">
          Tailor formatting, punctuation, and tone automatically based on what you are writing.
        </p>
      </div>

      {/* Mode Selectors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WRITING_MODES.map(mode => {
          const ModeIcon = modeIcons[mode.id] || Feather;
          const isSelected = activeTab === mode.id;
          const isDefault = settings.activeWritingMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => setActiveTab(mode.id)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-charcoal-850 border-brand ring-1 ring-brand text-white shadow-lg'
                  : 'bg-charcoal-900 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand/20 text-brand-light' : 'bg-charcoal-800 text-slate-400'}`}>
                  <ModeIcon className="w-4 h-4" />
                </div>
                {isDefault && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold tracking-wider uppercase">
                    Active
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-white">{mode.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{mode.description}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Mode Detail Showcase */}
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-brand/20 text-brand-light">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentModeInfo.name}</h2>
              <p className="text-xs text-slate-400">{currentModeInfo.description}</p>
            </div>
          </div>

          <button
            onClick={() => handleSetActive(currentModeInfo.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              settings.activeWritingMode === currentModeInfo.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-brand hover:bg-brand-hover text-white shadow-md shadow-brand/25'
            }`}
          >
            {settings.activeWritingMode === currentModeInfo.id ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Currently Active Mode</span>
              </>
            ) : (
              <span>Set as Active Mode</span>
            )}
          </button>
        </div>

        {/* Before and After Transformation Example */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Real Spoken vs Formatted Transformation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-charcoal-800/80 border border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Spoken Input</span>
              <p className="text-xs text-slate-300 font-mono italic">
                "{modeExamples[activeTab]?.spoken}"
              </p>
            </div>
            <div className="p-4 rounded-xl bg-charcoal-800 border border-brand/20 space-y-2">
              <span className="text-[10px] font-mono text-brand-light uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Formatted Output
              </span>
              <p className="text-xs text-white leading-relaxed whitespace-pre-wrap">
                {modeExamples[activeTab]?.output}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
