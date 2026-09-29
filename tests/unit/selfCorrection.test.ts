import { describe, it, expect } from 'vitest';
import { applySelfCorrection } from '../../packages/ai/src/pipeline/selfCorrection';

describe('Self-Correction Detection Unit Tests', () => {
  it('should repair "send it to Rahul, actually Rohit"', () => {
    const input = 'send it to Rahul, actually Rohit';
    const res = applySelfCorrection(input);
    expect(res.correctedText.toLowerCase()).toContain('send it to rohit');
    expect(res.correctedText.toLowerCase()).not.toContain('rahul');
    expect(res.selfCorrectionsAppliedCount).toBeGreaterThan(0);
  });

  it('should repair "meeting at five, no sorry six"', () => {
    const input = 'meeting at five, no sorry six';
    const res = applySelfCorrection(input);
    expect(res.correctedText.toLowerCase()).toContain('meeting at six');
    expect(res.correctedText.toLowerCase()).not.toContain('five');
  });

  it('should repair "Monday, actually Tuesday morning"', () => {
    const input = 'Monday, actually Tuesday morning';
    const res = applySelfCorrection(input);
    expect(res.correctedText.toLowerCase()).toContain('tuesday morning');
    expect(res.correctedText.toLowerCase()).not.toContain('monday');
  });

  it('should repair complex clause self-correction', () => {
    const input = 'can you send rahul the invoice actually not rahul send it to rohit tomorrow morning';
    const res = applySelfCorrection(input);
    expect(res.correctedText.toLowerCase()).toContain('rohit tomorrow morning');
    expect(res.correctedText.toLowerCase()).not.toContain('actually not');
  });

  it('should repair Hindi speech self-correction "Rahul ko nahi Rohit ko"', () => {
    const input = 'Rahul ko nahi Rohit ko proposal bhejo';
    const res = applySelfCorrection(input);
    expect(res.correctedText).toContain('Rohit ko');
  });
});
