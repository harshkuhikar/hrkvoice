/**
 * Settings API Routes for HRKVoice
 */

import { Router, Request, Response } from 'express';
import { SettingsService } from '../../services/settingsService';
import { SpeechManager } from '@hrkvoice/speech';
import { AIManager } from '@hrkvoice/ai';
import { LocalEncryptionService } from '@hrkvoice/utilities';

export const settingsRouter = Router();
const settingsService = new SettingsService();
const speechManager = new SpeechManager();
const aiManager = new AIManager();

function syncManagers() {
  const settings = settingsService.getSettings();
  speechManager.updateApiKeys({
    groq: settings.apiKeys.groq,
    openai: settings.apiKeys.openai,
    deepgram: settings.apiKeys.deepgram,
    google: settings.apiKeys.google
  });
  aiManager.updateApiKeys({
    groq: settings.apiKeys.groq,
    openai: settings.apiKeys.openai,
    gemini: settings.apiKeys.gemini,
    anthropic: settings.apiKeys.anthropic
  });
  speechManager.setPrimaryProvider(settings.speechProvider);
  aiManager.setPrimaryProvider(settings.aiProvider);
}
syncManagers();

settingsRouter.get('/', (req: Request, res: Response) => {
  const settings = settingsService.getSettings();

  // Mask API keys for safe display in UI
  const maskedKeys = {
    openai: settings.apiKeys.openai ? LocalEncryptionService.maskApiKey(settings.apiKeys.openai) : '',
    groq: settings.apiKeys.groq ? LocalEncryptionService.maskApiKey(settings.apiKeys.groq) : '',
    gemini: settings.apiKeys.gemini ? LocalEncryptionService.maskApiKey(settings.apiKeys.gemini) : '',
    anthropic: settings.apiKeys.anthropic ? LocalEncryptionService.maskApiKey(settings.apiKeys.anthropic) : '',
    deepgram: settings.apiKeys.deepgram ? LocalEncryptionService.maskApiKey(settings.apiKeys.deepgram) : '',
    google: settings.apiKeys.google ? LocalEncryptionService.maskApiKey(settings.apiKeys.google) : ''
  };

  res.json({
    success: true,
    settings: {
      ...settings,
      maskedApiKeys: maskedKeys
    }
  });
});

const updateHandler = (req: Request, res: Response) => {
  const updates = req.body;
  const updated = settingsService.updateSettings(updates);
  syncManagers();
  res.json({ success: true, settings: updated });
};

settingsRouter.put('/', updateHandler);
settingsRouter.post('/', updateHandler);

settingsRouter.post('/test-provider', async (req: Request, res: Response) => {
  const { type, providerId } = req.body;
  syncManagers();
  if (type === 'speech') {
    const result = await speechManager.testProvider(providerId);
    return res.json(result);
  } else if (type === 'ai') {
    const result = await aiManager.testProvider(providerId);
    return res.json(result);
  }
  return res.status(400).json({ success: false, message: 'Invalid provider type.' });
});
