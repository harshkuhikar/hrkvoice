import { describe, it, expect } from 'vitest';
import { SnippetManager } from '../../packages/dictionary/src/SnippetManager';

describe('Snippet Manager Unit Tests', () => {
  it('should initialize with default voice snippets', () => {
    const manager = new SnippetManager();
    const all = manager.getAll();
    expect(all.length).toBeGreaterThan(0);
    expect(all.some(s => s.trigger === 'my email')).toBe(true);
  });

  it('should match spoken trigger phrase accurately', () => {
    const manager = new SnippetManager();
    const match = manager.findMatchingSnippet('my email');
    expect(match).toBeDefined();
    expect(match?.content).toContain('Best regards');
  });

  it('should support adding and toggling snippets', () => {
    const manager = new SnippetManager([]);
    const snip = manager.add({
      trigger: 'demo link',
      title: 'Demo URL',
      content: 'https://hrkvoice.dev/demo',
      category: 'work',
      enabled: true
    });

    expect(manager.getAll().length).toBe(1);
    expect(manager.getEnabled().length).toBe(1);

    manager.toggle(snip.id);
    expect(manager.getEnabled().length).toBe(0);
  });
});
