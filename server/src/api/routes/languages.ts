/**
 * Languages API Routes for HRKVoice
 */

import { Router, Request, Response } from 'express';
import { getAllLanguages, getLanguageByCode, getSamplePhrase } from '@hrkvoice/shared';

export const languagesRouter = Router();

languagesRouter.get('/', (req: Request, res: Response) => {
  const list = getAllLanguages();
  res.json({
    success: true,
    total: list.length,
    languages: list
  });
});

languagesRouter.get('/:code', (req: Request, res: Response) => {
  const code = req.params.code;
  const lang = getLanguageByCode(code);
  if (!lang) {
    return res.status(404).json({ success: false, error: `Language '${code}' not found in registry.` });
  }
  return res.json({ success: true, language: lang });
});

languagesRouter.get('/:code/sample', (req: Request, res: Response) => {
  const code = req.params.code;
  const type = (req.query.type as any) || 'business';
  const phrase = getSamplePhrase(code, type);
  return res.json({ success: true, code, type, phrase });
});
