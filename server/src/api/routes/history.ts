/**
 * History API Routes for HRKVoice
 */

import { Router, Request, Response } from 'express';
import { HistoryService } from '../../services/historyService';

export const historyRouter = Router();
const historyService = new HistoryService();

historyRouter.get('/', (req: Request, res: Response) => {
  let items = historyService.getHistory();
  const search = (req.query.search as string)?.toLowerCase();
  const language = req.query.language as string;

  if (language && language !== 'all') {
    items = items.filter(i => i.sourceLanguage === language);
  }

  if (search) {
    items = items.filter(i =>
      i.processedText.toLowerCase().includes(search) ||
      i.rawTranscript.toLowerCase().includes(search)
    );
  }

  res.json({ success: true, count: items.length, history: items });
});

historyRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = historyService.deleteItem(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Item not found.' });
  return res.json({ success: true, message: 'Item deleted.' });
});

historyRouter.delete('/', (req: Request, res: Response) => {
  historyService.clearAllHistory();
  res.json({ success: true, message: 'History cleared successfully.' });
});

historyRouter.get('/export', (req: Request, res: Response) => {
  const format = (req.query.format as 'json' | 'csv' | 'txt') || 'json';
  const data = historyService.exportHistory(format);

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="hrkvoice-history.json"');
  } else if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="hrkvoice-history.csv"');
  } else {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="hrkvoice-history.txt"');
  }

  res.send(data);
});
