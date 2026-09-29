/**
 * Floating Recording Bar / Pill for HRKVoice Desktop
 * Minimal, lightweight overlay displayed during voice dictation
 */

import React, { useState, useEffect } from 'react';
import { Mic, X, Square, Check, Sparkles } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useHrkVoice } from '../hooks/useHrkVoice';

export const FloatingBar: React.FC = () => {
  const { settings, processAudio, insertText } = useHrkVoice();
  const [level, setLevel] = useState(0);
  const [statusText, setStatusText] = useState<'Listening' | 'Processing...' | 'Inserted!'>('Listening');

  const {
    isRecording,
    formattedDuration,
    startRecording,
    stopRecording,
    cancelRecording
  } = useAudioRecorder((lvl) => setLevel(lvl));

  // Listen to Electron shortcut signals
  useEffect(() => {
    if (!window.hrkVoice) return;

    const unbindToggle = window.hrkVoice.onShortcutRecordingToggled(async (recording) => {
      if (recording) {
        setStatusText('Listening');
        await startRecording();
      } else {
        setStatusText('Processing...');
        const audio = await stopRecording();
        if (audio && audio.base64) {
          try {
            const res = await processAudio(audio.base64);
            if (res && res.finalText) {
              await insertText(res.finalText);
              setStatusText('Inserted!');
              setTimeout(() => {
                window.hrkVoice?.hideFloatingBar();
                window.hrkVoice?.showMainWindow('scratchpad', res.finalText);
              }, 800);
            }
          } catch (err) {
            console.error(err);
            window.hrkVoice?.hideFloatingBar();
            window.hrkVoice?.showMainWindow('scratchpad');
          }
        } else {
          window.hrkVoice?.hideFloatingBar();
          window.hrkVoice?.showMainWindow('scratchpad');
        }
      }
    });

    const unbindCancel = window.hrkVoice.onShortcutRecordingCancelled(() => {
      cancelRecording();
      window.hrkVoice?.hideFloatingBar();
    });

    return () => {
      unbindToggle();
      unbindCancel();
    };
  }, [startRecording, stopRecording, cancelRecording, processAudio, insertText]);

  const handleManualStop = async () => {
    setStatusText('Processing...');
    const audio = await stopRecording();
    if (audio && audio.base64) {
      try {
        const res = await processAudio(audio.base64);
        if (res && res.finalText) {
          await insertText(res.finalText);
          setStatusText('Inserted!');
          setTimeout(() => {
            window.hrkVoice?.hideFloatingBar();
            window.hrkVoice?.showMainWindow('scratchpad', res.finalText);
          }, 800);
        }
      } catch (err) {
        console.error(err);
        window.hrkVoice?.hideFloatingBar();
        window.hrkVoice?.showMainWindow('scratchpad');
      }
    } else {
      window.hrkVoice?.hideFloatingBar();
      window.hrkVoice?.showMainWindow('scratchpad');
    }
  };

  const handleManualCancel = () => {
    cancelRecording();
    window.hrkVoice?.hideFloatingBar();
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2 select-none">
      <div className="glass-pill px-4 py-2.5 rounded-full flex items-center justify-between gap-4 w-[390px] shadow-2xl border border-white/10 bg-charcoal-900/95 text-slate-100">
        {/* Left Status Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            {statusText === 'Listening' && (
              <span className="absolute w-3 h-3 rounded-full bg-rose-500 animate-ping opacity-75" />
            )}
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                statusText === 'Listening'
                  ? 'bg-rose-500'
                  : statusText === 'Processing...'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
          </div>
          <div>
            <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
              <span>{statusText}</span>
              {statusText === 'Processing...' && <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />}
              {statusText === 'Inserted!' && <Check className="w-3 h-3 text-emerald-400" />}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {settings.defaultInputLanguage === 'auto' ? 'Multilingual Auto' : settings.defaultInputLanguage.toUpperCase()} • {formattedDuration}
            </div>
          </div>
        </div>

        {/* Center Waveform Visualizer */}
        <div className="flex-1 px-2">
          <AudioVisualizer level={level} isRecording={isRecording || statusText === 'Listening'} barCount={14} />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleManualStop}
            title="Complete & Insert"
            className="p-1.5 rounded-full bg-brand/20 hover:bg-brand text-brand-light hover:text-white transition-all text-xs"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={handleManualCancel}
            title="Cancel (Esc)"
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
