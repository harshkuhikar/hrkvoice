/**
 * Live Dictation Scratchpad & Playground Component for HRKVoice
 */

import React, { useState } from 'react';
import {
  Mic,
  Square,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Send,
  Wand2
} from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useHrkVoice } from '../hooks/useHrkVoice';
import { AudioVisualizer } from './AudioVisualizer';
import { WritingMode, INDIAN_LANGUAGE_REGISTRY, WRITING_MODES } from '@hrkvoice/shared';

export const Scratchpad: React.FC<{ initialText?: string }> = ({ initialText }) => {
  const {
    settings,
    processAudio,
    processText,
    rewriteText,
    insertText,
    updateSettings
  } = useHrkVoice();

  const [level, setLevel] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(settings.defaultInputLanguage || 'auto');
  const [selectedMode, setSelectedMode] = useState<WritingMode>(settings.activeWritingMode || 'general');
  const [rawTranscript, setRawTranscript] = useState<string>(initialText || '');
  const [processedText, setProcessedText] = useState<string>(initialText || '');
  const [transformations, setTransformations] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);

  React.useEffect(() => {
    if (initialText) {
      setProcessedText(initialText);
      setRawTranscript(initialText);
    }
  }, [initialText]);

  const {
    isRecording,
    formattedDuration,
    startRecording,
    stopRecording,
    cancelRecording
  } = useAudioRecorder(
    (lvl) => setLevel(lvl),
    (interimText) => setRawTranscript(interimText)
  );

  const handleToggleRecord = async () => {
    if (isRecording) {
      setIsProcessing(true);
      const audio = await stopRecording();
      if (audio) {
        try {
          const res = await processAudio(audio.base64, {
            language: selectedLanguage,
            mode: selectedMode,
            transcript: audio.transcript || rawTranscript
          });
          setRawTranscript(res.rawTranscript);
          setProcessedText(res.finalText);
          setTransformations(res.appliedTransformations);
        } catch (err: any) {
          alert(`Recording processing error: ${err.message}`);
        }
      }
      setIsProcessing(false);
    } else {
      setRawTranscript('');
      setProcessedText('');
      setTransformations(null);
      const localeMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        gu: 'gu-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
        pa: 'pa-IN',
        ur: 'ur-IN',
        auto: 'en-IN'
      };
      const locale = localeMap[selectedLanguage] || `${selectedLanguage}-IN`;
      await startRecording(locale);
    }
  };

  const handleRunTextProcess = async (text: string) => {
    if (!text) return;
    setIsProcessing(true);
    setRawTranscript(text);
    try {
      const res = await processText(text, {
        language: selectedLanguage,
        mode: selectedMode
      });
      setProcessedText(res.finalText);
      setTransformations(res.appliedTransformations);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRewrite = async (instruction: 'shorten' | 'expand' | 'professional' | 'casual' | 'bullets' | 'fix-grammar') => {
    if (!processedText) return;
    setIsProcessing(true);
    try {
      const res = await rewriteText(processedText, instruction);
      setProcessedText(res);
    } catch (err: any) {
      alert(`Rewrite failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!processedText) return;
    await navigator.clipboard.writeText(processedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = async () => {
    if (!processedText) return;
    await insertText(processedText);
    setInserted(true);
    setTimeout(() => setInserted(false), 2000);
  };

  const samplePresets = [
    {
      label: 'Hinglish Self-Correction',
      text: 'hey um can you send rahul the invoice actually not rahul send it to rohit tomorrow morning'
    },
    {
      label: 'Gujarati + Tech',
      text: 'કાલે client ને website નો demo send કરજો અને React component ચેક કરજો'
    },
    {
      label: 'Developer Dictation',
      text: 'create a component called user profile card with tailwind styling and create a use effect hook'
    },
    {
      label: 'Hindi Proposal',
      text: 'नमस्ते भाई कल क्लाइंट को नया प्रपोजल सेंड करना है एक्चुअली राहुल को नहीं रोहित को'
    }
  ];

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Top Controls Bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        {/* Language Selection */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Language:</label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedLanguage('gu')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'gu'
                  ? 'bg-brand text-white shadow-sm border border-brand-light/30'
                  : 'bg-charcoal-800 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              🇮🇳 ગુજરાતી
            </button>
            <button
              onClick={() => setSelectedLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedLanguage === 'hi'
                  ? 'bg-brand text-white shadow-sm border border-brand-light/30'
                  : 'bg-charcoal-800 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              🇮🇳 हिन्दी
            </button>
            <button
              onClick={() => setSelectedLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-brand text-white shadow-sm border border-brand-light/30'
                  : 'bg-charcoal-800 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              English
            </button>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-charcoal-800 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand"
          >
            <option value="auto">All 23 Languages...</option>
            {Object.values(INDIAN_LANGUAGE_REGISTRY).map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.displayName} ({lang.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Writing Mode Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {WRITING_MODES.map(mode => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedMode === mode.id
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-charcoal-800 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Microphone Interaction Station */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center space-y-6 bg-gradient-to-b from-charcoal-900 to-charcoal-850">
        <div className="text-center space-y-1">
          <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
            {isRecording ? 'Listening to your voice...' : isProcessing ? 'AI Processing & Cleaning...' : 'Ready to Dictate'}
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">
            {formattedDuration}
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="w-64 h-12 flex items-center justify-center">
          <AudioVisualizer level={level} isRecording={isRecording} barCount={20} />
        </div>

        {/* Big Record Button */}
        <div className="relative">
          {isRecording && (
            <div className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
          )}
          <button
            onClick={handleToggleRecord}
            disabled={isProcessing}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
              isRecording
                ? 'bg-rose-600 hover:bg-rose-500 text-white scale-105 shadow-rose-600/30'
                : 'bg-brand hover:bg-brand-hover text-white hover:scale-105 shadow-brand/30'
            }`}
          >
            {isRecording ? (
              <Square className="w-8 h-8 fill-current" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        <div className="text-xs text-slate-400 text-center">
          {isRecording
            ? 'Click square or release shortcut to finish recording'
            : `Click mic or press ${settings.pushToTalkShortcut} to speak`}
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-2 w-full border-t border-white/5 flex flex-wrap items-center justify-center gap-2">
          <span className="text-[11px] text-slate-400">Or test sample speech:</span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleRunTextProcess(preset.text)}
              className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-[11px] text-slate-300 border border-white/5 transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output Comparison Grid */}
      {(rawTranscript || processedText) && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Raw Transcript Card */}
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>Raw Spoken Transcript</span>
                <span className="text-[10px] text-slate-500 font-mono">Unfiltered</span>
              </div>
              <div className="p-3 rounded-lg bg-charcoal-850/80 border border-white/5 min-h-[110px] text-sm text-slate-300 font-mono whitespace-pre-wrap">
                {rawTranscript || 'Waiting for transcription...'}
              </div>
            </div>

            {/* AI Cleaned Final Text Card */}
            <div className="glass-panel p-5 rounded-xl border border-brand/20 bg-charcoal-900/90 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-brand-light">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>HRKVoice Final Polished Text</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand/20 text-brand-light">
                  {selectedMode}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-charcoal-850 border border-white/10 min-h-[110px] text-sm text-white leading-relaxed font-sans whitespace-pre-wrap">
                {processedText || 'Waiting for AI processing...'}
              </div>
            </div>
          </div>

          {/* Transformation Breakdown Badges */}
          {transformations && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-charcoal-900 border border-white/5 text-xs text-slate-300">
              <span className="text-slate-500 font-medium">Applied Repairs:</span>
              {transformations.selfCorrectionsApplied > 0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  {transformations.selfCorrectionsApplied} Self-Corrections Fixed
                </span>
              )}
              {transformations.fillersRemoved > 0 && (
                <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
                  {transformations.fillersRemoved} Fillers Removed
                </span>
              )}
              {transformations.technicalTermsPreserved?.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-brand/15 text-brand-light border border-brand/25">
                  Preserved: {transformations.technicalTermsPreserved.join(', ')}
                </span>
              )}
            </div>
          )}

          {/* Smart Rewrite Bar */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Wand2 className="w-3 h-3 text-brand-light" /> Rewrite:
              </span>
              <button
                onClick={() => handleRewrite('professional')}
                className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-200 border border-white/5"
              >
                Professional
              </button>
              <button
                onClick={() => handleRewrite('casual')}
                className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-200 border border-white/5"
              >
                Casual
              </button>
              <button
                onClick={() => handleRewrite('shorten')}
                className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-200 border border-white/5"
              >
                Shorten
              </button>
              <button
                onClick={() => handleRewrite('bullets')}
                className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-200 border border-white/5"
              >
                Convert to Bullets
              </button>
              <button
                onClick={() => handleRewrite('fix-grammar')}
                className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-xs text-slate-200 border border-white/5"
              >
                Fix Grammar
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 text-xs font-medium text-slate-200 border border-white/10 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleInsert}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand hover:bg-brand-hover text-xs font-semibold text-white transition-all shadow-md shadow-brand/20"
              >
                {inserted ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{inserted ? 'Inserted to App!' : 'Insert to Active App'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
