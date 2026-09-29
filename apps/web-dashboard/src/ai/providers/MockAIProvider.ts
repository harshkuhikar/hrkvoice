/**
 * Mock & Offline AI Provider for HRKVoice
 * Runs the deterministic local NLP pipeline without external cloud calls
 */

import { AIProvider, AIProcessOptions } from '../AIProvider';
import { AIProviderType, ProcessingResult } from '@hrkvoice/shared';
import { TextProcessingPipeline } from '../pipeline/TextProcessingPipeline';

export class MockAIProvider implements AIProvider {
  public readonly id: AIProviderType = 'mock';
  public readonly displayName = 'Local AI Cleanup Engine';
  public readonly isLocal = true;

  public isConfigured(): boolean {
    return true; // Always available offline
  }

  public async processTranscript(
    rawTranscript: string,
    options?: AIProcessOptions
  ): Promise<ProcessingResult> {
    // Execute local multi-stage pipeline directly
    return TextProcessingPipeline.execute(rawTranscript, {
      mode: options?.mode,
      sourceLanguage: options?.sourceLanguage,
      targetLanguage: options?.targetLanguage,
      context: options?.context,
      userDictionary: options?.userDictionary,
      snippets: options?.snippets,
      enableFillerRemoval: options?.enableFillerRemoval,
      enableSelfCorrection: options?.enableSelfCorrection,
      enableFormatting: options?.enableFormatting,
      preserveCodeSwitching: options?.preserveCodeSwitching
    });
  }

  public async rewriteText(
    text: string,
    instruction: 'shorten' | 'expand' | 'professional' | 'casual' | 'bullets' | 'fix-grammar' | string,
    language?: string
  ): Promise<string> {
    switch (instruction) {
      case 'shorten':
        return text.split(/(?<=[.?!])\s+/)[0] || text;
      case 'professional':
        return `I would like to kindly confirm: ${text}`;
      case 'casual':
        return text.replace(/Please find attached|Kindly/gi, 'Here is').trim();
      case 'bullets':
        return text.split(/\s+and\s+|,\s*/).map(p => `• ${p.trim()}`).join('\n');
      case 'fix-grammar':
      default:
        return TextProcessingPipeline.execute(text).finalText;
    }
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    const start = Date.now();
    await new Promise(r => setTimeout(r, 10));
    return {
      success: true,
      message: 'Local Offline AI Engine is active and running.',
      latencyMs: Date.now() - start
    };
  }
}
