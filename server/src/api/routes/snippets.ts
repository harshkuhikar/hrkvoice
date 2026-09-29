/**
 * Snippets API Routes for HRKVoice
 */

import { Router, Request, Response } from 'express';
import { SnippetService } from '../../services/snippetService';

export const snippetsRouter = Router();
const snippetService = new SnippetService();

snippetsRouter.get('/', (req: Request, res: Response) => {
  const snippets = snippetService.getAll();
  res.json({ success: true, count: snippets.length, snippets });
});

snippetsRouter.post('/', (req: Request, res: Response) => {
  const { trigger, title, content, category, enabled } = req.body;
  if (!trigger || !content) {
    return res.status(400).json({ success: false, error: 'Trigger and content are required.' });
  }

  const created = snippetService.add({
    trigger,
    title: title || trigger,
    content,
    category: category || 'general',
    enabled: enabled !== false
  });

  return res.status(201).json({ success: true, snippet: created });
});

snippetsRouter.put('/:id', (req: Request, res: Response) => {
  const updated = snippetService.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Snippet not found.' });
  }
  return res.json({ success: true, snippet: updated });
});

snippetsRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = snippetService.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Snippet not found.' });
  }
  return res.json({ success: true, message: 'Snippet deleted.' });
});

snippetsRouter.post('/:id/toggle', (req: Request, res: Response) => {
  const snippet = snippetService.getAll().find(s => s.id === req.params.id);
  if (!snippet) return res.status(404).json({ success: false, error: 'Snippet not found.' });
  const updated = snippetService.update(req.params.id, { enabled: !snippet.enabled });
  return res.json({ success: true, snippet: updated });
});
