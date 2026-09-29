/**
 * Global Shortcut & Desktop Dictation Simulator for HRKVoice
 * Demonstrates the Ctrl+Alt+Spacebar workflow across Windows applications
 */

import React, { useState } from 'react';
import {
  Mic,
  Square,
  Sparkles,
  Check,
  MessageSquare,
  Code2,
  FileText,
  Mail,
  ArrowRight,
  Zap
} from 'lucide-react';

interface SimulatedApp {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultContent: string;
  spokenScript: string;
  cleanedScript: string;
}

const SIMULATED_APPS: SimulatedApp[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp / Chat',
    icon: MessageSquare,
    defaultContent: 'Rahul: Hey, did you speak with the client about the new quotation?\n\nYou: ',
    spokenScript: 'હા ભાઈ વાત થઈ ગઈ છે, એક્ચ્યુઅલી રોહિતભાઈને 50 હજાર રૂપિયામાં વેબસાઇટ ફાઇનલ કરી છે',
    cleanedScript: 'હા વાત થઈ ગઈ છે, રોહિતભાઈને ₹50,000 માં વેબસાઇટ ફાઇનલ કરી છે.'
  },
  {
    id: 'notepad',
    name: 'Notepad / Word',
    icon: FileText,
    defaultContent: 'MEETING NOTES - 28 SEPT\n-------------------------\nAgenda: Client Deliverables\n\nNotes: ',
    spokenScript: 'નમસ્તે ટીમ કાલે સવારે દસ વાગ્યે પ્રોજેક્ટનો ડેમો બતાવવાનો છે અને રિવ્યુ કરવાનો છે',
    cleanedScript: 'નમસ્તે ટીમ, કાલે સવારે 10:00 વાગ્યે પ્રોજેક્ટનો ડેમો બતાવવાનો છે અને રિવ્યુ કરવાનો છે.'
  },
  {
    id: 'vscode',
    name: 'VS Code / Terminal',
    icon: Code2,
    defaultContent: '// HRKVoice API Integration\nasync function handleVoiceInput() {\n  ',
    spokenScript: 'create a post request to api transcription and send audio buffer with groq speech provider',
    cleanedScript: 'const response = await fetch("/api/transcription", { method: "POST", body: audioBuffer });'
  },
  {
    id: 'gmail',
    name: 'Gmail / Outlook',
    icon: Mail,
    defaultContent: 'Subject: Project Quotation Update\n\nDear Client,\n\n',
    spokenScript: 'please find attached the revised quotation for fifty thousand rupees as discussed',
    cleanedScript: 'Please find attached the revised quotation for ₹50,000 as discussed earlier today.'
  }
];

export const GlobalShortcutDemo: React.FC<{ onDownloadClick: () => void }> = ({ onDownloadClick }) => {
  const [activeApp, setActiveApp] = useState<SimulatedApp>(SIMULATED_APPS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasPasted, setHasPasted] = useState(false);
  const [isAppWindowOpen, setIsAppWindowOpen] = useState(false);
  const [typedText, setTypedText] = useState('');

  // Handle simulated global shortcut press
  const handleTriggerShortcut = () => {
    if (isProcessing) return;

    if (!isRecording) {
      // Step 1: Start recording
      setIsRecording(true);
      setHasPasted(false);
      setIsAppWindowOpen(false);
      setTypedText('');

      // Simulate real-time speaking in Gujarati / native script
      let currentIdx = 0;
      const fullText = activeApp.spokenScript;
      const interval = setInterval(() => {
        currentIdx += 3;
        if (currentIdx <= fullText.length) {
          setTypedText(fullText.slice(0, currentIdx));
        } else {
          clearInterval(interval);
        }
      }, 50);
    } else {
      // Step 2: Stop recording, process with AI, paste text, and auto-open application!
      setIsRecording(false);
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        setHasPasted(true);
        // Requirement: Application opens directly!
        setIsAppWindowOpen(true);
      }, 700);
    }
  };

  const handleReset = () => {
    setIsRecording(false);
    setIsProcessing(false);
    setHasPasted(false);
    setIsAppWindowOpen(false);
    setTypedText('');
  };

  return (
    <section id="shortcut-demo" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Global Background Shortcut Technology</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Record From Anywhere with <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-amber-300">Ctrl + Alt + Space</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          HRKVoice lives silently in your Windows background. Press the shortcut from <em>any</em> app. Speak freely in Gujarati, Hindi, or English. When you stop, your words are automatically typed down and the HRKVoice Studio opens directly.
        </p>
      </div>

      {/* Interactive Shortcut Demonstration Station */}
      <div className="bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Top Control Bar: Key Presser + Target App Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5">
          {/* Virtual Keyboard Shortcut Trigger */}
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Press Shortcut:</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <kbd className="px-2.5 py-1.5 rounded-lg bg-charcoal-800 border border-white/20 text-white font-bold shadow-md shadow-black/40">
                Ctrl
              </kbd>
              <span className="text-slate-500">+</span>
              <kbd className="px-2.5 py-1.5 rounded-lg bg-charcoal-800 border border-white/20 text-white font-bold shadow-md shadow-black/40">
                Alt
              </kbd>
              <span className="text-slate-500">+</span>
              <kbd className="px-3.5 py-1.5 rounded-lg bg-charcoal-800 border border-white/20 text-white font-bold shadow-md shadow-black/40">
                Space
              </kbd>
            </div>

            <button
              onClick={handleTriggerShortcut}
              className={`ml-3 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                isRecording
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 animate-pulse'
                  : 'bg-brand hover:bg-brand-hover text-white shadow-brand/25'
              }`}
            >
              {isRecording ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop & Open App</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Simulate Shortcut</span>
                </>
              )}
            </button>

            {hasPasted && (
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* App Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium mr-1 hidden lg:inline">Target Window:</span>
            {SIMULATED_APPS.map((app) => {
              const Icon = app.icon;
              const isActive = activeApp.id === app.id;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    setActiveApp(app);
                    handleReset();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{app.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Windows Desktop Simulation Workspace */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Target App Window (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-charcoal-950/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[340px] relative">
            {/* Window Title Bar */}
            <div className="px-4 py-2.5 bg-charcoal-900 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <activeApp.icon className="w-4 h-4 text-brand-light" />
                <span className="text-xs font-semibold text-slate-200">{activeApp.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
              </div>
            </div>

            {/* Window Editor Content */}
            <div className="p-4 flex-1 font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto whitespace-pre-wrap select-none relative">
              <span>{activeApp.defaultContent}</span>

              {/* Dictated text appears here */}
              {hasPasted ? (
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                  {activeApp.cleanedScript}
                </span>
              ) : isRecording ? (
                <span className="text-brand-light animate-pulse">{typedText}▍</span>
              ) : (
                <span className="text-slate-600 italic">Click "Simulate Shortcut" to begin speaking...</span>
              )}
            </div>

            {/* Floating Recording Pill Overlay (Pops up at top of active window) */}
            {isRecording && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 rounded-full bg-charcoal-900/95 border border-brand/40 shadow-2xl flex items-center gap-3 backdrop-blur-md">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide">Listening (ગુજરાતી / Hi)...</span>
                  <div className="flex items-center gap-1">
                    {[30, 70, 45, 90, 60, 40, 75, 50].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-brand rounded-full animate-pulse"
                        style={{ height: `${h * 0.22}px`, animationDelay: `${i * 90}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Processing Toast */}
            {isProcessing && (
              <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30">
                <div className="px-4 py-2 rounded-full bg-charcoal-900 border border-amber-400/40 shadow-xl flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Groq Whisper & AI Formatting...</span>
                </div>
              </div>
            )}

            {/* Pasted Status Footer */}
            {hasPasted && (
              <div className="p-2.5 bg-emerald-950/30 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-400 px-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5" /> Text automatically pasted into active app!
                </span>
                <span className="text-[10px] text-slate-400 font-mono">28ms latency</span>
              </div>
            )}
          </div>

          {/* HRKVoice Desktop Application Window (Right 5 Cols - Opens directly on stop!) */}
          <div
            className={`lg:col-span-5 bg-charcoal-900 border rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[340px] transition-all duration-500 relative ${
              isAppWindowOpen
                ? 'border-brand ring-2 ring-brand/30 shadow-brand/20 scale-100 opacity-100'
                : 'border-white/10 opacity-60 scale-95'
            }`}
          >
            {/* App Window Header */}
            <div className="px-4 py-2.5 bg-charcoal-850 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-brand flex items-center justify-center text-[9px] font-bold text-white">
                  H
                </div>
                <span className="text-xs font-bold text-white">HRKVoice Desktop Studio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                  {isAppWindowOpen ? '● Opened Directly' : 'Running in Tray'}
                </span>
              </div>
            </div>

            {/* App Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-[11px] font-semibold text-slate-400">Latest Captured Dictation</span>
                  <span className="text-[10px] text-brand-light font-mono">ગુજરાતી • Whisper Large-v3</span>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-charcoal-950 border border-white/5 text-xs text-white leading-relaxed min-h-[90px]">
                  {hasPasted ? (
                    <span>{activeApp.cleanedScript}</span>
                  ) : (
                    <span className="text-slate-500 italic">
                      When you stop recording with Ctrl+Alt+Space, this window opens directly with your clean dictation.
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons inside app */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {hasPasted ? '✓ Saved to History' : 'Awaiting shortcut...'}
                </span>
                <button
                  onClick={onDownloadClick}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-white text-xs font-semibold shadow transition-all"
                >
                  <span>Download App</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Summary Pills */}
        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-3.5 rounded-xl bg-charcoal-950/60 border border-white/5 space-y-1">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand-light flex items-center justify-center text-[10px]">1</span>
              Press Ctrl+Alt+Space
            </span>
            <p className="text-[11px] text-slate-400">
              Works anywhere on Windows even if HRKVoice is closed to tray.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-charcoal-950/60 border border-white/5 space-y-1">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand-light flex items-center justify-center text-[10px]">2</span>
              Speak Naturally
            </span>
            <p className="text-[11px] text-slate-400">
              Speak fluently in Gujarati, Hindi, or English. Floating bar records live audio.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-charcoal-950/60 border border-white/5 space-y-1">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-brand/20 text-brand-light flex items-center justify-center text-[10px]">3</span>
              Release & App Opens
            </span>
            <p className="text-[11px] text-slate-400">
              AI writes down text into your active app and HRKVoice window pops open instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
