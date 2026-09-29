/**
 * First Launch Onboarding Wizard for HRKVoice Desktop
 */

import React, { useState } from 'react';
import { Mic, Globe, Keyboard, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useHrkVoice } from '../hooks/useHrkVoice';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { INDIAN_LANGUAGE_REGISTRY } from '@hrkvoice/shared';

interface OnboardingModalProps {
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const { settings, updateSettings } = useHrkVoice();
  const [step, setStep] = useState(1);
  const [selectedLang, setSelectedLang] = useState('auto');
  const [micTested, setMicTested] = useState(false);

  const { startRecording, stopRecording, isRecording } = useAudioRecorder();

  const handleTestMic = async () => {
    if (!isRecording) {
      const ok = await startRecording();
      if (ok) {
        setTimeout(async () => {
          await stopRecording();
          setMicTested(true);
        }, 2000);
      }
    }
  };

  const handleFinish = async () => {
    await updateSettings({
      defaultInputLanguage: selectedLang,
      onboardingCompleted: true
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-8 rounded-3xl border border-white/10 bg-charcoal-900 shadow-2xl space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-white/5 pb-3">
          <span>Step {step} of 4</span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <span
                key={s}
                className={`w-2 h-2 rounded-full ${s === step ? 'bg-brand' : s < step ? 'bg-emerald-400' : 'bg-charcoal-700'}`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-indigo-700 mx-auto flex items-center justify-center shadow-xl shadow-brand/25 text-white font-mono font-bold text-2xl">
              HRK
            </div>
            <h2 className="text-2xl font-extrabold text-white">Welcome to HRKVoice</h2>
            <p className="text-slate-300 text-xs leading-relaxed max-w-md mx-auto">
              India's first voice productivity platform designed for natural speech, Hinglish code-switching, and instant desktop text insertion.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-semibold shadow-lg shadow-brand/25 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: MICROPHONE PERMISSION */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand/20 text-brand-light">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Microphone Verification</h3>
                <p className="text-xs text-slate-400">Let's verify your microphone access.</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-charcoal-850 border border-white/5 text-center space-y-3">
              <button
                onClick={handleTestMic}
                disabled={isRecording}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  micTested
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-brand hover:bg-brand-hover text-white'
                }`}
              >
                {isRecording ? 'Listening for 2 seconds...' : micTested ? '✓ Microphone Verified!' : 'Test Microphone'}
              </button>
              <p className="text-[11px] text-slate-400">
                {micTested
                  ? 'Your microphone is connected and working perfectly.'
                  : 'Click above to test microphone permission.'}
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="text-xs text-slate-400 hover:text-white">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LANGUAGE SELECTION */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand/20 text-brand-light">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Choose Your Languages</h3>
                <p className="text-xs text-slate-400">Select your primary spoken language or keep Auto-Detect.</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-slate-300 font-medium">Default Speech Language</label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full bg-charcoal-800 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand"
              >
                <option value="auto">Auto-Detect (Indian + English Code-Switching)</option>
                {Object.values(INDIAN_LANGUAGE_REGISTRY).map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.displayName} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(2)} className="text-xs text-slate-400 hover:text-white">
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: SHORTCUT & FINISH */}
        {step === 4 && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-brand/20 text-brand-light">
                <Keyboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Global Push-to-Talk</h3>
                <p className="text-xs text-slate-400">Hold shortcut anywhere on Windows to dictate.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-charcoal-850 border border-white/5 text-center space-y-2">
              <div className="text-xs text-slate-400">Default Shortcut:</div>
              <kbd className="inline-block px-4 py-2 rounded-xl bg-charcoal-800 border border-white/15 text-lg font-mono text-white font-bold tracking-wider">
                {settings.pushToTalkShortcut}
              </kbd>
              <p className="text-[11px] text-slate-400 pt-1">
                You can customize this anytime in Settings.
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(3)} className="text-xs text-slate-400 hover:text-white">
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25"
              >
                <Check className="w-4 h-4" />
                <span>Start Using HRKVoice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
