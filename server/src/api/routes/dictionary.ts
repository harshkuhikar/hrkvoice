/**
 * Dictionary API Routes for HRKVoice
 */

import { Router, Request, Response } from 'express';
import { DictionaryService } from '../../services/dictionaryService';

export const dictionaryRouter = Router();
const dictionaryService = new DictionaryService();

dictionaryRouter.get('/', (req: Request, res: Response) => {
  const entries = dictionaryService.getAll();
  res.json({ success: true, count: entries.length, entries });
});

dictionaryRouter.post('/', (req: Request, res: Response) => {
  const { word, pronunciation, preferredSpelling, language, category, enabled, notes } = req.body;
  if (!word || !preferredSpelling) {
    return res.status(400).json({ success: false, error: 'Word and preferredSpelling are required.' });
  }

  const created = dictionaryService.add({
    word,
    pronunciation,
    preferredSpelling,
    language: language || 'all',
    category: category || 'personal',
    enabled: enabled !== false,
    notes
  });

  return res.status(201).json({ success: true, entry: created });
});

dictionaryRouter.put('/:id', (req: Request, res: Response) => {
  const updated = dictionaryService.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Entry not found.' });
  }
  return res.json({ success: true, entry: updated });
});

dictionaryRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = dictionaryService.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Entry not found.' });
  }
  return res.json({ success: true, message: 'Entry removed successfully.' });
});

dictionaryRouter.post('/:id/toggle', (req: Request, res: Response) => {
  const entry = dictionaryService.getAll().find(e => e.id === req.params.id);
  if (!entry) return res.status(404).json({ success: false, error: 'Entry not found.' });
  const updated = dictionaryService.update(req.params.id, { enabled: !entry.enabled });
  return res.json({ success: true, entry: updated });
});
