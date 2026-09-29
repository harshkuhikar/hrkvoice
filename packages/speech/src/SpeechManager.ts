/**
 * Speech Manager for HRKVoice
 * Orchestrates multi-provider fallback chains, capability checking, and active provider selection
 */

import { SpeechProvider, TranscribeOptions, TranscriptionResponse } from './SpeechProvider';
import { SpeechProviderType, getLanguageByCode } from '@hrkvoice/shared';
import { MockSpeechProvider } from './providers/MockSpeechProvider';
import { GroqSpeechProvider } from './providers/GroqSpeechProvider';
import { OpenAISpeechProvider } from './providers/OpenAISpeechProvider';
import { DeepgramSpeechProvider } from './providers/DeepgramSpeechProvider';
import { GoogleSpeechProvider } from './providers/GoogleSpeechProvider';

export class SpeechManager {
  private providers: Map<SpeechProviderType, SpeechProvider> = new Map();
  private primaryProviderId: SpeechProviderType = 'mock';

  constructor() {
    this.registerProvider(new MockSpeechProvider());
    this.registerProvider(new GroqSpeechProvider());
    this.registerProvider(new OpenAISpeechProvider());
    this.registerProvider(new DeepgramSpeechProvider());
    this.registerProvider(new GoogleSpeechProvider());
  }

  public registerProvider(provider: SpeechProvider): void {
    this.providers.set(provider.id, provider);
  }

  public setPrimaryProvider(id: SpeechProviderType): void {
    if (this.providers.has(id)) {
      this.primaryProviderId = id;
    } else {
      console.warn(`[SpeechManager] Unknown provider: ${id}, falling back to mock`);
      this.primaryProviderId = 'mock';
    }
  }

  public getPrimaryProvider(): SpeechProvider {
    return this.providers.get(this.primaryProviderId) || this.providers.get('mock')!;
  }

  public getProvider(id: SpeechProviderType): SpeechProvider | undefined {
    return this.providers.get(id);
  }

  public getAllProviders(): { id: SpeechProviderType; name: string; isConfigured: boolean; isLocal: boolean }[] {
    return Array.from(this.providers.values()).map(p => ({
      id: p.id,
      name: p.displayName,
      isConfigured: p.isConfigured(),
      isLocal: p.isLocal
    }));
  }

  public updateApiKeys(keys: {
    groq?: string;
    openai?: string;
    deepgram?: string;
    google?: string;
  }): void {
    if (keys.groq) {
      (this.providers.get('groq') as GroqSpeechProvider)?.setApiKey(keys.groq);
    }
    if (keys.openai) {
      (this.providers.get('openai') as OpenAISpeechProvider)?.setApiKey(keys.openai);
    }
    if (keys.deepgram) {
      (this.providers.get('deepgram') as DeepgramSpeechProvider)?.setApiKey(keys.deepgram);
    }
    if (keys.google) {
      (this.providers.get('google') as GoogleSpeechProvider)?.setApiKey(keys.google);
    }
  }

  /**
   * Transcribe with automatic fallback chain:
   * 1. Primary provider
   * 2. Capability check
   * 3. Configured fallback provider
   * 4. Safe offline fallback
   */
  public async transcribe(
    audioData: Buffer | Uint8Array,
    options?: TranscribeOptions
  ): Promise<TranscriptionResponse> {
    const requestedLang = options?.language || 'auto';
    const primary = this.getPrimaryProvider();

    // 1. Try Primary if configured & supports language
    if (primary.isConfigured() && (requestedLang === 'auto' || primary.supportsLanguage(requestedLang))) {
      try {
        return await primary.transcribe(audioData, options);
      } catch (err: any) {
        console.warn(`[SpeechManager] Primary provider (${primary.id}) failed: ${err.message}. Engaging fallback...`);
      }
    }

    // 2. Fallback Chain: Check other configured cloud providers
    const candidateProviders: SpeechProviderType[] = ['groq', 'openai', 'deepgram', 'google'];
    for (const pid of candidateProviders) {
      if (pid === primary.id) continue;
      const candidate = this.providers.get(pid);
      if (candidate && candidate.isConfigured() && (requestedLang === 'auto' || candidate.supportsLanguage(requestedLang))) {
        try {
          console.info(`[SpeechManager] Fallback engaging provider: ${candidate.displayName}`);
          return await candidate.transcribe(audioData, options);
        } catch (fbErr: any) {
          console.warn(`[SpeechManager] Fallback candidate ${pid} failed: ${fbErr.message}`);
        }
      }
    }

    // 3. Fallback to Local Offline / Demo Provider
    const mock = this.providers.get('mock')!;
    console.info('[SpeechManager] Falling back to local demo/offline engine');
    return await mock.transcribe(audioData, options);
  }

  /**
   * Test connection to a provider
   */
  public async testProvider(id: SpeechProviderType) {
    const provider = this.providers.get(id);
    if (!provider) {
      return { success: false, message: `Provider ${id} does not exist.` };
    }
    return await provider.testConnection();
  }
}
