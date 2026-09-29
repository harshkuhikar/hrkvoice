/**
 * AI Processing and Rewriting API Routes for HRKVoice
 */

import { Router, Request, Response } from 'express';
import { AIManager } from '@hrkvoice/ai';
import { DictionaryService } from '../../services/dictionaryService';
import { SnippetService } from '../../services/snippetService';
import { SettingsService } from '../../services/settingsService';

export const aiRouter = Router();
const aiManager = new AIManager();
const dictionaryService = new DictionaryService();
const snippetService = new SnippetService();
const settingsService = new SettingsService();

aiRouter.post('/process', async (req: Request, res: Response) => {
  const {
    text,
    mode,
    sourceLanguage,
    targetLanguage,
    context
  } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, error: 'Text is required for AI processing.' });
  }

  const currentSettings = settingsService.getSettings();
  aiManager.updateApiKeys({
    groq: currentSettings.apiKeys.groq,
    openai: currentSettings.apiKeys.openai,
    gemini: currentSettings.apiKeys.gemini,
    anthropic: currentSettings.apiKeys.anthropic
  });
  aiManager.setPrimaryProvider(currentSettings.aiProvider);

  try {
    const result = await aiManager.process(text, {
      mode: mode || currentSettings.activeWritingMode || 'general',
      sourceLanguage: sourceLanguage || currentSettings.defaultInputLanguage,
      targetLanguage: targetLanguage || currentSettings.defaultOutputLanguage,
      context,
      userDictionary: dictionaryService.getAll().filter(d => d.enabled),
      snippets: snippetService.getAll().filter(s => s.enabled),
      enableFillerRemoval: currentSettings.enableFillerRemoval,
      enableSelfCorrection: currentSettings.enableSelfCorrection,
      enableFormatting: currentSettings.enableSpokenFormatting,
      preserveCodeSwitching: currentSettings.preserveCodeSwitching
    });

    return res.json({ success: true, result });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

aiRouter.post('/rewrite', async (req: Request, res: Response) => {
  const { text, instruction, language } = req.body;
  if (!text || !instruction) {
    return res.status(400).json({ success: false, error: 'Text and instruction are required.' });
  }

  try {
    const rewritten = await aiManager.rewrite(text, instruction, language);
    return res.json({ success: true, rewritten });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
