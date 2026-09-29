import { describe, it, expect } from 'vitest';
import { TextProcessingPipeline } from '../../packages/ai/src/pipeline/TextProcessingPipeline';
import { INITIAL_DICTIONARY_ENTRIES, INITIAL_SNIPPETS } from '../../packages/shared/src/sampleData';

describe('AI Text Processing Pipeline Unit Tests', () => {
  it('should process speech repair and filler removal together', () => {
    const raw = 'hey um can you send rahul the invoice actually not rahul send it to rohit tomorrow morning';
    const result = TextProcessingPipeline.execute(raw, { mode: 'general' });

    expect(result.finalText.toLowerCase()).toContain('send it to rohit tomorrow morning');
    expect(result.finalText.toLowerCase()).not.toContain('rahul');
    expect(result.appliedTransformations.fillersRemoved).toBeGreaterThan(0);
    expect(result.appliedTransformations.selfCorrectionsApplied).toBeGreaterThan(0);
  });

  it('should preserve technical terms exact casing in Hinglish speech', () => {
    const raw = 'kal mujhe react project ka deployment karna hai aur node.js api test karni hai';
    const result = TextProcessingPipeline.execute(raw, { mode: 'general' });

    expect(result.finalText).toContain('React');
    expect(result.finalText).toContain('Node.js');
    expect(result.finalText).toContain('API');
  });

  it('should expand dictionary terms from user vocabulary', () => {
    const raw = 'please schedule a meeting with senaptech and qubeta';
    const result = TextProcessingPipeline.execute(raw, {
      userDictionary: INITIAL_DICTIONARY_ENTRIES
    });

    expect(result.finalText).toContain('Senaptiq');
    expect(result.finalText).toContain('Qubeta');
  });

  it('should expand snippet triggers into full templates', () => {
    const raw = 'my email';
    const result = TextProcessingPipeline.execute(raw, {
      snippets: INITIAL_SNIPPETS
    });

    expect(result.finalText).toContain('Best regards');
    expect(result.appliedTransformations.snippetsExpanded).toBe(1);
  });

  it('should format spoken layout commands correctly', () => {
    const raw = 'first item new line second item bullet point third item';
    const result = TextProcessingPipeline.execute(raw, { mode: 'general' });

    expect(result.finalText).toContain('\n');
    expect(result.finalText).toContain('•');
  });

  it('should handle spoken "cancel" command by discarding output', () => {
    const raw = 'cancel recording';
    const result = TextProcessingPipeline.execute(raw);
    expect(result.finalText).toBe('');
    expect(result.warnings?.[0]).toContain('cancel');
  });

  it('should format email mode with greeting and sign-off', () => {
    const raw = 'hi rahul just following up on the proposal can you send me the updated quotation by tomorrow';
    const result = TextProcessingPipeline.execute(raw, { mode: 'email' });

    expect(result.finalText).toContain('Hi Rahul,');
    expect(result.finalText).toContain('Thanks.');
  });
});
