/**
 * AI Manager for HRKVoice
 * Orchestrates AI providers, key management, fallback chains, and text cleanup
 */

import { AIProvider, AIProcessOptions } from './AIProvider';
import { AIProviderType, ProcessingResult } from '@hrkvoice/shared';
import { MockAIProvider } from './providers/MockAIProvider';
import { GroqAIProvider } from './providers/GroqAIProvider';
import { OpenAIAIProvider } from './providers/OpenAIAIProvider';
import { GeminiAIProvider } from './providers/GeminiAIProvider';
import { AnthropicAIProvider } from './providers/AnthropicAIProvider';

export class AIManager {
  private providers: Map<AIProviderType, AIProvider> = new Map();
  private primaryProviderId: AIProviderType = 'mock';

  constructor() {
    this.registerProvider(new MockAIProvider());
    this.registerProvider(new GroqAIProvider());
    this.registerProvider(new OpenAIAIProvider());
    this.registerProvider(new GeminiAIProvider());
    this.registerProvider(new AnthropicAIProvider());
  }

  public registerProvider(provider: AIProvider): void {
    this.providers.set(provider.id, provider);
  }

  public setPrimaryProvider(id: AIProviderType): void {
    if (this.providers.has(id)) {
      this.primaryProviderId = id;
    } else {
      console.warn(`[AIManager] Unknown provider: ${id}, defaulting to mock`);
      this.primaryProviderId = 'mock';
    }
  }

  public getPrimaryProvider(): AIProvider {
    return this.providers.get(this.primaryProviderId) || this.providers.get('mock')!;
  }

  public getProvider(id: AIProviderType): AIProvider | undefined {
    return this.providers.get(id);
  }

  public getAllProviders(): { id: AIProviderType; name: string; isConfigured: boolean; isLocal: boolean }[] {
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
    gemini?: string;
    anthropic?: string;
  }): void {
    if (keys.groq) {
      (this.providers.get('groq') as GroqAIProvider)?.setApiKey(keys.groq);
    }
    if (keys.openai) {
      (this.providers.get('openai') as OpenAIAIProvider)?.setApiKey(keys.openai);
    }
    if (keys.gemini) {
      (this.providers.get('gemini') as GeminiAIProvider)?.setApiKey(keys.gemini);
    }
    if (keys.anthropic) {
      (this.providers.get('anthropic') as AnthropicAIProvider)?.setApiKey(keys.anthropic);
    }
  }

  public async process(
    rawTranscript: string,
    options?: AIProcessOptions
  ): Promise<ProcessingResult> {
    const primary = this.getPrimaryProvider();

    // 1. Try Primary if configured
    if (primary.isConfigured()) {
      try {
        return await primary.processTranscript(rawTranscript, options);
      } catch (err: any) {
        console.warn(`[AIManager] Primary AI provider (${primary.id}) error: ${err.message}. Engaging fallback...`);
      }
    }

    // 2. Check other configured cloud providers
    const candidateProviders: AIProviderType[] = ['groq', 'openai', 'gemini', 'anthropic'];
    for (const pid of candidateProviders) {
      if (pid === primary.id) continue;
      const candidate = this.providers.get(pid);
      if (candidate && candidate.isConfigured()) {
        try {
          return await candidate.processTranscript(rawTranscript, options);
        } catch (fbErr: any) {
          console.warn(`[AIManager] Fallback candidate ${pid} failed: ${fbErr.message}`);
        }
      }
    }

    // 3. Fallback to Local Offline Pipeline
    const mock = this.providers.get('mock')!;
    return await mock.processTranscript(rawTranscript, options);
  }

  public async rewrite(
    text: string,
    instruction: 'shorten' | 'expand' | 'professional' | 'casual' | 'bullets' | 'fix-grammar' | string,
    language?: string
  ): Promise<string> {
    const primary = this.getPrimaryProvider();
    if (primary.isConfigured()) {
      try {
        return await primary.rewriteText(text, instruction, language);
      } catch {
        // Fallback
      }
    }
    const mock = this.providers.get('mock')!;
    return await mock.rewriteText(text, instruction, language);
  }

  public async testProvider(id: AIProviderType) {
    const provider = this.providers.get(id);
    if (!provider) return { success: false, message: `Provider ${id} not found.` };
    return await provider.testConnection();
  }
}
