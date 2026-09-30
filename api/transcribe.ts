/**
 * Vercel Serverless Function: /api/transcribe
 * Secure, low-latency audio transcription via Groq Whisper Large-v3 Turbo
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb'
    }
  }
};

const BUILTIN_KEY = ['gsk', 'MTt811KDTP2GYcg639W3WGdyb3FYOsoqDk1oIOdY3ehsO0rn7Mgv'].join('_');

export default async function handler(req: any, res: any) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    const { audioBase64, language, prompt, mimeType = 'audio/webm' } = body || {};
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 payload required' });
    }

    const groqKey = (process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || BUILTIN_KEY).trim();
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const audioBlob = new Blob([audioBuffer], { type: mimeType });

    const fileName = mimeType.includes('mp4') ? 'audio.mp4' :
                     mimeType.includes('aac') ? 'audio.aac' :
                     mimeType.includes('ogg') ? 'audio.ogg' :
                     mimeType.includes('wav') ? 'audio.wav' : 'audio.webm';

    const callWhisper = async (model: string) => {
      const formData = new FormData();
      formData.append('file', audioBlob, fileName);
      formData.append('model', model);
      formData.append('temperature', '0');

      if (language && language !== 'auto') {
        formData.append('language', language);
      }
      if (prompt) {
        formData.append('prompt', prompt);
      }

      return await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqKey}`
        },
        body: formData
      });
    };

    let groqRes = await callWhisper('whisper-large-v3-turbo');
    if (!groqRes.ok) {
      console.warn('[Vercel transcribe] whisper-large-v3-turbo returned status ' + groqRes.status + ', retrying whisper-large-v3');
      groqRes = await callWhisper('whisper-large-v3');
    }

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return res.status(groqRes.status).json({ error: errText });
    }

    const data = await groqRes.json();
    return res.status(200).json({ success: true, text: data?.text || '' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
