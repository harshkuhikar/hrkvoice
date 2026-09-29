import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../../server/src/app';
import http from 'http';

describe('Server API Routes Integration Tests', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as any;
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('GET /api/health should return healthy status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('healthy');
  });

  it('GET /api/languages should return all 23 languages', async () => {
    const res = await fetch(`${baseUrl}/api/languages`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.total).toBe(23);
  });

  it('GET /api/settings and PUT /api/settings should work', async () => {
    const getRes = await fetch(`${baseUrl}/api/settings`);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.settings).toBeDefined();

    const putRes = await fetch(`${baseUrl}/api/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeWritingMode: 'developer' })
    });
    expect(putRes.status).toBe(200);
    const putData = await putRes.json();
    expect(putData.settings.activeWritingMode).toBe('developer');
  });

  it('POST /api/dictionary should add new term', async () => {
    const res = await fetch(`${baseUrl}/api/dictionary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        word: 'Scalezix',
        preferredSpelling: 'Scalezix',
        category: 'company'
      })
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.entry.preferredSpelling).toBe('Scalezix');
  });

  it('POST /api/transcription should transcribe and process audio', async () => {
    const res = await fetch(`${baseUrl}/api/transcription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'hi',
        mode: 'general'
      })
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.result.finalText).toBeTruthy();
  });

  it('GET /api/usage should return aggregated statistics', async () => {
    const res = await fetch(`${baseUrl}/api/usage`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.usage).toBeDefined();
    expect(typeof data.usage.totalSessions).toBe('number');
  });
});
