/**
 * Translation API Routes for HRKVoice
 */

import { Router, Request, Response } from 'express';
import { AIManager } from '@hrkvoice/ai';
import { getLanguageByCode } from '@hrkvoice/shared';

export const translationRouter = Router();
const aiManager = new AIManager();

translationRouter.post('/', async (req: Request, res: Response) => {
  const { text, from, to } = req.body;
  if (!text || !to) {
    return res.status(400).json({ success: false, error: 'Text and target language are required.' });
  }

  const targetLangDef = getLanguageByCode(to);
  const targetName = targetLangDef?.displayName || to;

  try {
    const result = await aiManager.rewrite(
      text,
      `Translate accurately to ${targetName}. Preserve technical words like React, Node.js, API, GitHub.`,
      to
    );
    return res.json({
      success: true,
      originalText: text,
      translatedText: result,
      sourceLanguage: from || 'auto',
      targetLanguage: to
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
