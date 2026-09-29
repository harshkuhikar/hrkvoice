/**
 * Usage Analytics API Routes for HRKVoice
 */

import { Router, Request, Response } from 'express';
import { HistoryService } from '../../services/historyService';

export const usageRouter = Router();
const historyService = new HistoryService();

usageRouter.get('/', (req: Request, res: Response) => {
  const usage = historyService.getUsage();
  res.json({
    success: true,
    usage
  });
});
