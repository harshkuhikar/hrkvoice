/**
 * Express Error Handling Middleware for HRKVoice
 */

import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred in HRKVoice server.';

  console.error(`[HRKVoice Server Error] ${req.method} ${req.url} -> ${status}:`, message);

  res.status(status).json({
    success: false,
    error: {
      message,
      statusCode: status,
      path: req.path,
      timestamp: new Date().toISOString()
    }
  });
}
