/**
 * HRKVoice Express Application Configuration
 */

import express from 'express';
import cors from 'cors';
import { transcriptionRouter } from './api/routes/transcription';
import { aiRouter } from './api/routes/ai';
import { translationRouter } from './api/routes/translation';
import { languagesRouter } from './api/routes/languages';
import { settingsRouter } from './api/routes/settings';
import { dictionaryRouter } from './api/routes/dictionary';
import { snippetsRouter } from './api/routes/snippets';
import { historyRouter } from './api/routes/history';
import { usageRouter } from './api/routes/usage';
import { errorHandler } from './api/middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'HRKVoice Server',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API modules
  app.use('/api/transcription', transcriptionRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/translation', translationRouter);
  app.use('/api/languages', languagesRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/dictionary', dictionaryRouter);
  app.use('/api/snippets', snippetsRouter);
  app.use('/api/history', historyRouter);
  app.use('/api/usage', usageRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
