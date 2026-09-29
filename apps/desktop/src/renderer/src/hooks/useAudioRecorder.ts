/**
 * Custom React Hook for Audio Recording, Real-Time Level Analysis, and Live Web Speech Recognition
 */

import { useState, useRef, useEffect, useCallback } from 'react';

export interface AudioRecorderHook {
  isRecording: boolean;
  audioLevel: number;
  durationSeconds: number;
  formattedDuration: string;
  liveTranscript: string;
  error: string | null;
  startRecording: (locale?: string) => Promise<boolean>;
  stopRecording: () => Promise<{ blob: Blob; base64: string; transcript: string } | null>;
  cancelRecording: () => void;
}

export function useAudioRecorder(
  onAudioLevelChange?: (level: number) => void,
  onInterimText?: (text: string) => void
): AudioRecorderHook {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Chrome Web Speech Recognition
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef('');
  const shouldListenRef = useRef(false);

  const formattedDuration = `${Math.floor(durationSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(durationSeconds % 60).toString().padStart(2, '0')}`;

  const cleanUpAudioGraph = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    shouldListenRef.current = false;
    setAudioLevel(0);
    if (onAudioLevelChange) onAudioLevelChange(0);
  };

  const startRecording = useCallback(async (locale: string = 'en-IN'): Promise<boolean> => {
    try {
      setError(null);
      chunksRef.current = [];
      setDurationSeconds(0);
      setLiveTranscript('');
      accumulatedTranscriptRef.current = '';
      shouldListenRef.current = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      streamRef.current = stream;

      // Audio analysis graph
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Realtime level analysis loop
      const pcmData = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(pcmData);
        let sum = 0;
        for (let i = 0; i < pcmData.length; i++) {
          sum += pcmData[i];
        }
        const avg = sum / pcmData.length;
        const normalized = Math.min(1, Math.max(0, avg / 128));
        setAudioLevel(normalized);
        if (onAudioLevelChange) onAudioLevelChange(normalized);
        if (window.hrkVoice?.syncAudioLevel) {
          window.hrkVoice.syncAudioLevel(normalized);
        }
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      animFrameRef.current = requestAnimationFrame(updateLevel);

      // Duration timer
      timerRef.current = setInterval(() => {
        setDurationSeconds(prev => prev + 1);
      }, 1000);

      // Start Chrome Native Speech Recognition if available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = locale;

          rec.onresult = (event: any) => {
            let finalStr = '';
            let interimStr = '';
            for (let i = 0; i < event.results.length; i++) {
              const res = event.results[i];
              const text = res[0]?.transcript || '';
              if (res.isFinal) {
                finalStr += (finalStr ? ' ' : '') + text.trim();
              } else {
                interimStr += text;
              }
            }
            accumulatedTranscriptRef.current = finalStr;
            const full = (finalStr + (interimStr ? ' ' + interimStr : '')).trim();
            setLiveTranscript(full);
            if (onInterimText) onInterimText(full);
          };

          rec.onerror = (e: any) => {
            console.warn('[Desktop SpeechRecognition Error]:', e.error);
          };

          rec.onend = () => {
            if (shouldListenRef.current) {
              try { rec.start(); } catch {}
            }
          };

          rec.start();
          recognitionRef.current = rec;
        } catch (e) {
          console.warn('[Desktop SpeechRecognition] Could not init speech:', e);
        }
      }

      // MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      return true;
    } catch (err: any) {
      console.error('[useAudioRecorder] Mic access error:', err);
      const msg = err.name === 'NotAllowedError'
        ? 'Microphone permission denied. Please allow microphone access in Chrome.'
        : `Microphone unavailable: ${err.message || 'Check connection'}`;
      setError(msg);
      cleanUpAudioGraph();
      return false;
    }
  }, [onAudioLevelChange, onInterimText]);

  const stopRecording = useCallback(async (): Promise<{ blob: Blob; base64: string; transcript: string } | null> => {
    return new Promise((resolve) => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }

      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        cleanUpAudioGraph();
        setIsRecording(false);
        resolve({
          blob: new Blob([], { type: 'audio/webm' }),
          base64: '',
          transcript: accumulatedTranscriptRef.current.trim()
        });
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const finalTrans = accumulatedTranscriptRef.current.trim();
        cleanUpAudioGraph();
        setIsRecording(false);

        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result as string;
          const base64 = res.split(',')[1] || '';
          resolve({ blob, base64, transcript: finalTrans });
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  const cancelRecording = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    chunksRef.current = [];
    cleanUpAudioGraph();
    setIsRecording(false);
    setDurationSeconds(0);
    setLiveTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      cleanUpAudioGraph();
    };
  }, []);

  return {
    isRecording,
    audioLevel,
    durationSeconds,
    formattedDuration,
    liveTranscript,
    error,
    startRecording,
    stopRecording,
    cancelRecording
  };
}
