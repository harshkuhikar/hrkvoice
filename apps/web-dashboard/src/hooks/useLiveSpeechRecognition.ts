/**
 * Production Real-time Speech Recognition & Web Audio Visualizer Hook for HRKVoice
 * 
 * Clean, Zero-Conflict Architecture:
 * - Single source of truth for live streaming: Native Web Speech API streams 0ms word-by-word
 * - Mobile fallback: Only runs periodic slicing on browsers without Web Speech (iOS Safari)
 * - Persistent across breath pauses without duplicate phrases or race conditions
 * - High-speed Web Audio API 16-band visualizer with live decibel response
 */

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseLiveSpeechRecognitionProps {
  onFinalTranscript?: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
}

export function useLiveSpeechRecognition({
  onFinalTranscript,
  onInterimTranscript
}: UseLiveSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [frequencyBars, setFrequencyBars] = useState<number[]>(new Array(16).fill(6));
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const shouldKeepListeningRef = useRef(false);
  const isStartingRecognitionRef = useRef(false);
  const currentLocaleRef = useRef('gu-IN');
  const currentLangCodeRef = useRef('gu');

  // Text Persistence across speech breath pauses
  const persistedSessionTextRef = useRef('');
  const currentTurnFinalRef = useRef('');

  // Web Audio Graph refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const cleanupAudioGraph = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
    setFrequencyBars(new Array(16).fill(6));
  }, []);

  const startAudioMeter = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;
      if (audioCtx.state === 'suspended') {
        try {
          await audioCtx.resume();
        } catch {}
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateMeter = () => {
        if (!analyserRef.current || !shouldKeepListeningRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        const bars: number[] = [];
        const step = Math.max(1, Math.floor(bufferLength / 16));

        for (let i = 0; i < 16; i++) {
          const val = dataArray[i * step] || 0;
          bars.push(Math.max(8, Math.round((val / 255) * 100)));
          sum += val;
        }

        const avg = sum / (bufferLength || 1);
        const normalized = Math.min(1, Math.max(0, avg / 110));
        setAudioLevel(normalized);
        setFrequencyBars(bars);

        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };

      animationFrameRef.current = requestAnimationFrame(updateMeter);

      // MediaRecorder initialization for final uncompressed neural transcription
      recordedChunksRef.current = [];
      let selectedMime = '';
      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        const candidates = [
          'audio/webm;codecs=opus',
          'audio/webm',
          'audio/mp4',
          'audio/aac',
          'audio/ogg;codecs=opus'
        ];
        for (const cand of candidates) {
          if (MediaRecorder.isTypeSupported(cand)) {
            selectedMime = cand;
            break;
          }
        }
      }

      const recorderOptions: MediaRecorderOptions = selectedMime ? { mimeType: selectedMime } : {};
      const recorder = new MediaRecorder(stream, recorderOptions);
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };
      recorder.start(100);
      mediaRecorderRef.current = recorder;
    } catch (err: any) {
      console.warn('[AudioMeter] Microphone access error:', err);
      setError('Microphone permission required. Please allow microphone access in your browser.');
    }
  }, []);

  const initRecognition = useCallback((locale: string) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = locale;

    recognition.onstart = () => {
      isStartingRecognitionRef.current = false;
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let currentFinal = '';
      let currentInterim = '';

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        const text = item[0]?.transcript || '';
        if (item.isFinal) {
          currentFinal += (currentFinal ? ' ' : '') + text.trim();
        } else {
          currentInterim += (currentInterim ? ' ' : '') + text.trim();
        }
      }

      currentTurnFinalRef.current = currentFinal;

      // Pure clean accumulation: previous committed sentences + current finalized + active word
      const fullText = [
        persistedSessionTextRef.current,
        currentFinal,
        currentInterim
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      if (fullText) {
        setTranscript(fullText);
        setInterimTranscript(currentInterim);

        // Immediate word-by-word streaming callback to canvas
        if (onInterimTranscript) {
          onInterimTranscript(fullText);
        }
      }
    };

    recognition.onerror = (event: any) => {
      isStartingRecognitionRef.current = false;
      console.warn('[SpeechRecognition] Event notice:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission was denied. Please allow microphone access in browser settings.');
        shouldKeepListeningRef.current = false;
        setIsListening(false);
        cleanupAudioGraph();
      } else if (event.error === 'audio-capture') {
        setError('No microphone found. Please connect your microphone.');
        shouldKeepListeningRef.current = false;
        setIsListening(false);
        cleanupAudioGraph();
      }
    };

    recognition.onend = () => {
      isStartingRecognitionRef.current = false;

      // Commit finalized text from this utterance so pauses never erase words
      if (currentTurnFinalRef.current) {
        persistedSessionTextRef.current = [
          persistedSessionTextRef.current,
          currentTurnFinalRef.current
        ]
          .filter(Boolean)
          .join(' ')
          .trim();
        currentTurnFinalRef.current = '';
      }

      // Safe continuous restart when user pauses for breath
      if (shouldKeepListeningRef.current) {
        setTimeout(() => {
          if (shouldKeepListeningRef.current && recognitionRef.current && !isStartingRecognitionRef.current) {
            try {
              isStartingRecognitionRef.current = true;
              recognitionRef.current.start();
            } catch (e) {
              isStartingRecognitionRef.current = false;
            }
          }
        }, 40);
      } else {
        setIsListening(false);
        cleanupAudioGraph();
        const finalOutput = persistedSessionTextRef.current.trim();
        if (onFinalTranscript) {
          onFinalTranscript(finalOutput);
        }
      }
    };

    return recognition;
  }, [cleanupAudioGraph, onFinalTranscript, onInterimTranscript]);

  const startListening = useCallback(async (locale: string = 'gu-IN', langCode: string = 'gu') => {
    setError(null);
    currentLocaleRef.current = locale;
    currentLangCodeRef.current = langCode;
    shouldKeepListeningRef.current = true;
    currentTurnFinalRef.current = '';

    // Start Web Audio meter and MediaRecorder
    await startAudioMeter();

    // Start native SpeechRecognition if available
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const rec = initRecognition(locale);
    recognitionRef.current = rec;

    if (rec && !isStartingRecognitionRef.current) {
      try {
        isStartingRecognitionRef.current = true;
        rec.start();
      } catch (err: any) {
        isStartingRecognitionRef.current = false;
      }
    }

    setIsListening(true);
  }, [initRecognition, startAudioMeter]);

  const stopListening = useCallback(async (): Promise<{ text: string; audioBlob: Blob | null; audioBase64: string }> => {
    shouldKeepListeningRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    let audioBlob: Blob | null = null;
    let audioBase64 = '';

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        await new Promise<void>((resolve) => {
          if (!mediaRecorderRef.current) return resolve();
          mediaRecorderRef.current.onstop = () => {
            const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
            const blob = new Blob(recordedChunksRef.current, { type: mimeType });
            audioBlob = blob;
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              audioBase64 = res.split(',')[1] || '';
              resolve();
            };
            reader.readAsDataURL(blob);
          };
          mediaRecorderRef.current.stop();
        });
      } catch (e) {
        console.warn('Could not export audio recording:', e);
      }
    }

    setIsListening(false);
    cleanupAudioGraph();

    const finalResult = [
      persistedSessionTextRef.current,
      currentTurnFinalRef.current
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    persistedSessionTextRef.current = finalResult;
    currentTurnFinalRef.current = '';

    if (onFinalTranscript) {
      onFinalTranscript(finalResult);
    }

    return { text: finalResult, audioBlob, audioBase64 };
  }, [cleanupAudioGraph, onFinalTranscript]);

  const resetTranscript = useCallback(() => {
    persistedSessionTextRef.current = '';
    currentTurnFinalRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const setManualTranscript = useCallback((text: string) => {
    persistedSessionTextRef.current = text;
    currentTurnFinalRef.current = '';
    setTranscript(text);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      cleanupAudioGraph();
    };
  }, [cleanupAudioGraph]);

  return {
    isListening,
    transcript,
    interimTranscript,
    audioLevel,
    frequencyBars,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setManualTranscript
  };
}
