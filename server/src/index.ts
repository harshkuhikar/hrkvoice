import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { createApp } from './app';

export { createApp };

export function startServer(port: number = 4321) {
  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`[HRKVoice Server] Running on http://localhost:${port}`);
    console.log(`[HRKVoice Server] Health check available at http://localhost:${port}/api/health`);
  });
  return server;
}

if (require.main === module) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4321;
  startServer(PORT);
}

export default startServer;

