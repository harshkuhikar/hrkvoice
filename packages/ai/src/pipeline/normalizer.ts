/**
 * Text Normalization Stage for HRKVoice Pipeline
 */

export function normalizeTranscript(raw: string): string {
  if (!raw) return '';

  return raw
    .replace(/[\r\t\f]/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .trim();
}
