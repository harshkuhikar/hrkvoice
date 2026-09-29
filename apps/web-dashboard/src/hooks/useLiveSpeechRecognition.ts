/**
 * Real-time Speech Recognition & Web Audio Visualizer Hook for HRKVoice
 * Powered by native Chrome Speech Recognition Engine + Web Audio API
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
  const [frequencyBars, setFrequencyBars] = useState<number[]>(new Array(16).fill(5));
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);
  const shouldKeepListeningRef = useRef(false);
  const currentLocaleRef = useRef('en-IN');
  const accumulatedFinalRef = useRef('');

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
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not natively supported in this browser. Please use Google Chrome for full functionality.');
    }
  }, []);

  const cleanupAudioGraph = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
    setFrequencyBars(new Array(16).fill(5));
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

        // Calculate average level
        let sum = 0;
        const bars: number[] = [];
        const step = Math.max(1, Math.floor(bufferLength / 16));

        for (let i = 0; i < 16; i++) {
          const val = dataArray[i * step] || 0;
          bars.push(Math.max(6, Math.round((val / 255) * 100)));
          sum += val;
        }

        const avg = sum / (bufferLength || 1);
        const normalized = Math.min(1, Math.max(0, avg / 120));
        setAudioLevel(normalized);
        setFrequencyBars(bars);

        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };

      animationFrameRef.current = requestAnimationFrame(updateMeter);

      // Universal MediaRecorder for Android, iOS Safari, and Desktop browsers
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
      console.warn('[AudioMeter] Could not start visualizer:', err);
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
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let finalStr = '';
      let interimStr = '';

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i];
        const text = item[0]?.transcript || '';
        if (item.isFinal) {
          finalStr += (finalStr ? ' ' : '') + text.trim();
        } else {
          interimStr += text;
        }
      }

      accumulatedFinalRef.current = finalStr;
      const fullCurrent = (finalStr + (interimStr ? ' ' + interimStr : '')).trim();
      setTranscript(fullCurrent);
      setInterimTranscript(interimStr);

      if (onInterimTranscript) {
        onInterimTranscript(fullCurrent);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('[SpeechRecognition] Error event:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone access was denied. Please allow microphone permission in your Chrome address bar (click the tune/lock icon).');
        shouldKeepListeningRef.current = false;
        setIsListening(false);
        cleanupAudioGraph();
      } else if (event.error === 'audio-capture') {
        setError('No microphone found. Please connect a working microphone.');
        shouldKeepListeningRef.current = false;
        setIsListening(false);
        cleanupAudioGraph();
      } else if (event.error === 'network') {
        // Network blip with Google speech servers
        console.warn('Network issue during speech recognition');
      }
    };

    recognition.onend = () => {
      // If user did not explicitly stop recording, auto-restart continuous listening
      if (shouldKeepListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // If already started, ignore
        }
      } else {
        setIsListening(false);
        cleanupAudioGraph();
        if (onFinalTranscript) {
          onFinalTranscript(accumulatedFinalRef.current.trim());
        }
      }
    };

    return recognition;
  }, [cleanupAudioGraph, onFinalTranscript, onInterimTranscript]);

  const startListening = useCallback(async (locale: string = 'en-IN') => {
    setError(null);
    currentLocaleRef.current = locale;
    shouldKeepListeningRef.current = true;

    // Start Web Audio meter for real-time visual waves
    await startAudioMeter();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const rec = initRecognition(locale);
    recognitionRef.current = rec;

    if (rec) {
      try {
        rec.start();
      } catch (err: any) {
        console.warn('[SpeechRecognition] Browser real-time speech unavailable; Groq Whisper neural engine will transcribe audio:', err);
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
          try {
            mediaRecorderRef.current.requestData();
          } catch {}
          mediaRecorderRef.current.stop();
        });
      } catch (e) {
        console.warn('Could not export audio recording:', e);
      }
    }

    setIsListening(false);
    cleanupAudioGraph();

    const finalResult = accumulatedFinalRef.current.trim();
    if (onFinalTranscript) {
      onFinalTranscript(finalResult);
    }
    return { text: finalResult, audioBlob, audioBase64 };
  }, [cleanupAudioGraph, onFinalTranscript]);

  const resetTranscript = useCallback(() => {
    accumulatedFinalRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const setManualTranscript = useCallback((text: string) => {
    accumulatedFinalRef.current = text;
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
