import { describe, it, expect } from 'vitest';
import { removeFillerWords } from '../../packages/ai/src/pipeline/fillerRemover';

describe('Filler Remover Unit Tests', () => {
  it('should remove vocal hesitations like um, uh, er, hmm', () => {
    const input = 'hey um can you send the uh file to hmm rohit';
    const res = removeFillerWords(input);
    expect(res.cleanedText.toLowerCase()).toBe('hey can you send the file to rohit');
    expect(res.fillersRemovedCount).toBeGreaterThanOrEqual(3);
  });

  it('should remove Indian conversational filler words', () => {
    const input = 'woh kya bolte hai kal client ko matlab invoice send karna hai';
    const res = removeFillerWords(input);
    expect(res.cleanedText).toContain('kal client ko');
    expect(res.cleanedText).not.toContain('woh kya bolte hai');
  });

  it('should preserve meaningful uses of words like actually', () => {
    // "I actually need the file" carries semantic weight
    const input = 'I actually need the file.';
    const res = removeFillerWords(input);
    expect(res.cleanedText).toBe('I actually need the file.');
  });

  it('should strip standalone sentence-start actually filler', () => {
    const input = 'Actually, send the invoice tomorrow.';
    const res = removeFillerWords(input);
    expect(res.cleanedText.toLowerCase()).toBe('send the invoice tomorrow.');
  });
});
