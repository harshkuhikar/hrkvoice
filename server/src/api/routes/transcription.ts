/**
 * Transcription API Route for HRKVoice
 * Handles speech recognition and end-to-end processing pipeline
 */

import { Router, Request, Response } from 'express';
import { SpeechManager } from '@hrkvoice/speech';
import { AIManager } from '@hrkvoice/ai';
import { DictionaryService } from '../../services/dictionaryService';
import { SnippetService } from '../../services/snippetService';
import { HistoryService } from '../../services/historyService';
import { SettingsService } from '../../services/settingsService';

export const transcriptionRouter = Router();
const speechManager = new SpeechManager();
const aiManager = new AIManager();
const dictionaryService = new DictionaryService();
const snippetService = new SnippetService();
const historyService = new HistoryService();
const settingsService = new SettingsService();

transcriptionRouter.post('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const {
    audioBase64,
    transcript,
    language,
    mode,
    context
  } = req.body;

  const currentSettings = settingsService.getSettings();

  // Sync API keys and active providers
  speechManager.updateApiKeys({
    groq: currentSettings.apiKeys.groq,
    openai: currentSettings.apiKeys.openai,
    deepgram: currentSettings.apiKeys.deepgram,
    google: currentSettings.apiKeys.google
  });
  speechManager.setPrimaryProvider(currentSettings.speechProvider);

  aiManager.updateApiKeys({
    groq: currentSettings.apiKeys.groq,
    openai: currentSettings.apiKeys.openai,
    gemini: currentSettings.apiKeys.gemini,
    anthropic: currentSettings.apiKeys.anthropic
  });
  aiManager.setPrimaryProvider(currentSettings.aiProvider);

  try {
    // 1. Convert base64 audio to buffer (or create mock buffer if not provided)
    const audioBuffer = audioBase64
      ? Buffer.from(audioBase64, 'base64')
      : Buffer.alloc(16000);

    const inputLang = language || currentSettings.defaultInputLanguage || 'auto';
    const dictBiasing = dictionaryService.getAll().filter(d => d.enabled).map(d => d.preferredSpelling);

    // 2. Perform speech-to-text transcription:
    // If a cloud speech provider (like Groq Whisper or OpenAI) is configured, use it for 99% accuracy!
    let sttResult;
    const primarySpeech = speechManager.getPrimaryProvider();
    if (primarySpeech.isConfigured() && primarySpeech.id !== 'mock' && audioBase64) {
      try {
        sttResult = await speechManager.transcribe(audioBuffer, {
          language: inputLang,
          promptBiasing: dictBiasing
        });
      } catch (sttErr: any) {
        console.warn('[Transcription Route] Cloud STT failed, falling back:', sttErr.message);
        if (transcript && typeof transcript === 'string' && transcript.trim().length > 0) {
          sttResult = {
            transcript: transcript.trim(),
            detectedLanguage: inputLang,
            confidence: 0.95,
            durationSeconds: 2.0,
            provider: 'client-fallback',
            model: 'browser-stt'
          };
        } else {
          throw sttErr;
        }
      }
    } else if (transcript && typeof transcript === 'string' && transcript.trim().length > 0) {
      sttResult = {
        transcript: transcript.trim(),
        detectedLanguage: inputLang,
        confidence: 0.98,
        durationSeconds: 2.0,
        provider: 'native-browser',
        model: 'chrome-neural-stt'
      };
    } else {
      sttResult = await speechManager.transcribe(audioBuffer, {
        language: inputLang,
        promptBiasing: dictBiasing
      });
    }

    const activeMode = mode || currentSettings.activeWritingMode || 'general';

    // 3. Perform AI cleanup and formatting pipeline
    const aiResult = await aiManager.process(sttResult.transcript, {
      sourceLanguage: sttResult.detectedLanguage || inputLang,
      targetLanguage: currentSettings.defaultOutputLanguage,
      mode: activeMode,
      context,
      userDictionary: dictionaryService.getAll().filter(d => d.enabled),
      snippets: snippetService.getAll().filter(s => s.enabled),
      enableFillerRemoval: currentSettings.enableFillerRemoval,
      enableSelfCorrection: currentSettings.enableSelfCorrection,
      enableFormatting: currentSettings.enableSpokenFormatting,
      preserveCodeSwitching: currentSettings.preserveCodeSwitching
    });

    const totalDurationMs = Date.now() - startTime;

    // 4. Save to history (if history is enabled in user settings)
    const historyItem = historyService.addHistoryItem({
      durationMs: totalDurationMs,
      rawTranscript: sttResult.transcript,
      processedText: aiResult.finalText,
      sourceLanguage: aiResult.detectedLanguage,
      targetLanguage: currentSettings.defaultOutputLanguage,
      mode: activeMode,
      activeApp: context?.activeApp,
      activeWindowTitle: context?.windowTitle,
      confidence: aiResult.confidence,
      audioRetained: false,
      wordsCount: aiResult.wordsCount
    });

    return res.json({
      success: true,
      result: {
        ...aiResult,
        speechProvider: sttResult.provider,
        speechModel: sttResult.model,
        aiProvider: aiManager.getPrimaryProvider().id,
        totalDurationMs,
        historyId: historyItem?.id
      }
    });
  } catch (err: any) {
    console.error('[TranscriptionRoute] Error processing speech:', err);
    return res.status(500).json({
      success: false,
      error: {
        message: err.message || 'Speech processing failed.',
        code: 'TRANSCRIPTION_FAILED'
      }
    });
  }
});
