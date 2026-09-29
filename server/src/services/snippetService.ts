/**
 * Snippet Service for HRKVoice Server
 */

import { Snippet } from '@hrkvoice/shared';
import { DatabaseStore } from '../database/db';

export class SnippetService {
  private db: DatabaseStore;

  constructor() {
    this.db = DatabaseStore.getInstance();
  }

  public getAll(): Snippet[] {
    return [...this.db.getData().snippets];
  }

  public add(snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>): Snippet {
    const id = `snip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const newSnip: Snippet = {
      ...snippet,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.db.updateData(data => {
      data.snippets.unshift(newSnip);
    });

    return newSnip;
  }

  public update(id: string, updates: Partial<Omit<Snippet, 'id' | 'createdAt'>>): Snippet | undefined {
    let updated: Snippet | undefined;

    this.db.updateData(data => {
      const idx = data.snippets.findIndex(s => s.id === id);
      if (idx !== -1) {
        data.snippets[idx] = {
          ...data.snippets[idx],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        updated = data.snippets[idx];
      }
    });

    return updated;
  }

  public delete(id: string): boolean {
    let deleted = false;
    this.db.updateData(data => {
      const initLen = data.snippets.length;
      data.snippets = data.snippets.filter(s => s.id !== id);
      deleted = data.snippets.length < initLen;
    });
    return deleted;
  }
}
