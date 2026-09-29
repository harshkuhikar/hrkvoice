import { describe, it, expect } from 'vitest';
import { MockSpeechProvider } from '../../packages/speech/src/providers/MockSpeechProvider';
import { SpeechManager } from '../../packages/speech/src/SpeechManager';

describe('Speech Providers Unit Tests', () => {
  it('MockSpeechProvider should transcribe sample audio buffer', async () => {
    const provider = new MockSpeechProvider();
    expect(provider.isConfigured()).toBe(true);
    expect(provider.isLocal).toBe(true);

    const dummyAudio = Buffer.alloc(16000);
    const result = await provider.transcribe(dummyAudio, { language: 'hi' });

    expect(result.transcript).toBeTruthy();
    expect(result.detectedLanguage).toBe('hi');
    expect(result.provider).toBe('mock');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('MockSpeechProvider should stream partial transcripts when callback provided', async () => {
    const provider = new MockSpeechProvider();
    const partials: string[] = [];

    const dummyAudio = Buffer.alloc(16000);
    const result = await provider.transcribe(dummyAudio, {
      language: 'en',
      onPartialTranscript: (p) => partials.push(p)
    });

    expect(partials.length).toBeGreaterThan(0);
    expect(result.transcript).toBe(partials[partials.length - 1]);
  });

  it('SpeechManager should gracefully fallback to mock provider', async () => {
    const manager = new SpeechManager();
    // Default is mock
    expect(manager.getPrimaryProvider().id).toBe('mock');

    const dummyAudio = Buffer.alloc(16000);
    const res = await manager.transcribe(dummyAudio, { language: 'auto' });
    expect(res.transcript).toBeTruthy();
    expect(res.provider).toBe('mock');
  });

  it('SpeechManager should test connection successfully', async () => {
    const manager = new SpeechManager();
    const testRes = await manager.testProvider('mock');
    expect(testRes.success).toBe(true);
  });
});
