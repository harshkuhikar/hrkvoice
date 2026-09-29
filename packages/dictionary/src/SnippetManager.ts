/**
 * Snippet Manager for HRKVoice
 * Handles trigger-to-template expansions (e.g. "my email", "meeting intro")
 */

import { Snippet, INITIAL_SNIPPETS } from '@hrkvoice/shared';

export class SnippetManager {
  private snippets: Map<string, Snippet> = new Map();

  constructor(initialList?: Snippet[]) {
    const list = initialList !== undefined ? initialList : INITIAL_SNIPPETS;
    list.forEach(snip => this.snippets.set(snip.id, { ...snip }));
  }

  public getAll(): Snippet[] {
    return Array.from(this.snippets.values());
  }

  public getEnabled(): Snippet[] {
    return this.getAll().filter(s => s.enabled);
  }

  public getById(id: string): Snippet | undefined {
    return this.snippets.get(id);
  }

  public add(snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>): Snippet {
    const id = `snip-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();
    const newSnip: Snippet = {
      ...snippet,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.snippets.set(id, newSnip);
    return newSnip;
  }

  public update(id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>): Snippet | undefined {
    const existing = this.snippets.get(id);
    if (!existing) return undefined;
    const updated: Snippet = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.snippets.set(id, updated);
    return updated;
  }

  public delete(id: string): boolean {
    return this.snippets.delete(id);
  }

  public toggle(id: string): boolean {
    const existing = this.snippets.get(id);
    if (!existing) return false;
    existing.enabled = !existing.enabled;
    existing.updatedAt = new Date().toISOString();
    return true;
  }

  public findMatchingSnippet(transcript: string): Snippet | undefined {
    const clean = transcript.trim().toLowerCase();
    for (const snip of this.getEnabled()) {
      if (clean === snip.trigger.toLowerCase()) {
        return snip;
      }
    }
    return undefined;
  }

  public exportToJSON(): string {
    return JSON.stringify(this.getAll(), null, 2);
  }

  public importFromJSON(jsonString: string): { imported: number; errors: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Expected array');
      let count = 0;
      for (const item of parsed) {
        if (item.trigger && item.content) {
          this.add({
            trigger: item.trigger,
            title: item.title || item.trigger,
            content: item.content,
            category: item.category || 'general',
            enabled: item.enabled !== false
          });
          count++;
        }
      }
      return { imported: count, errors: 0 };
    } catch {
      return { imported: 0, errors: 1 };
    }
  }
}
