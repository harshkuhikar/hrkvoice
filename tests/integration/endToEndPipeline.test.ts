import { describe, it, expect } from 'vitest';
import { SpeechManager } from '../../packages/speech/src/SpeechManager';
import { AIManager } from '../../packages/ai/src/AIManager';
import { SafeClipboardService } from '../../packages/utilities/src/clipboard';
import { INITIAL_DICTIONARY_ENTRIES } from '../../packages/shared/src/sampleData';

describe('End-to-End Pipeline Integration Test', () => {
  it('should run full audio-to-text-to-insertion workflow seamlessly', async () => {
    // 1. Initialize Speech and AI Managers
    const speechManager = new SpeechManager();
    const aiManager = new AIManager();

    let clipboardMemory = '';
    const clipboardAdapter = {
      readText: () => clipboardMemory,
      writeText: (t: string) => { clipboardMemory = t; }
    };
    const clipboardService = new SafeClipboardService(clipboardAdapter);

    // 2. Audio input (simulated)
    const audioBuffer = Buffer.alloc(16000);
    const speechResult = await speechManager.transcribe(audioBuffer, {
      language: 'en'
    });

    expect(speechResult.transcript).toBeTruthy();

    // 3. AI Text Processing & Cleanup
    const processed = await aiManager.process(speechResult.transcript, {
      mode: 'general',
      sourceLanguage: speechResult.detectedLanguage,
      userDictionary: INITIAL_DICTIONARY_ENTRIES,
      enableFillerRemoval: true,
      enableSelfCorrection: true
    });

    expect(processed.finalText).toBeTruthy();
    expect(processed.confidence).toBeGreaterThan(0.9);

    // 4. Text Insertion via clipboard with restoration
    clipboardMemory = 'Existing Clipboard Content';
    let targetAppReceivedText = '';

    const insertion = await clipboardService.insertWithClipboardPreservation(
      processed.finalText,
      () => {
        // App simulates pasting
        targetAppReceivedText = clipboardService.copyToClipboard(processed.finalText)
          ? processed.finalText
          : '';
      },
      40
    );

    expect(insertion.success).toBe(true);
    expect(targetAppReceivedText).toBe(processed.finalText);

    // Wait for clipboard restore
    await new Promise(r => setTimeout(r, 60));
    expect(clipboardAdapter.readText()).toBe('Existing Clipboard Content');
  });
});
