/**
 * Dictionary Service for HRKVoice Server
 */

import { DictionaryEntry } from '@hrkvoice/shared';
import { DatabaseStore } from '../database/db';

export class DictionaryService {
  private db: DatabaseStore;

  constructor() {
    this.db = DatabaseStore.getInstance();
  }

  public getAll(): DictionaryEntry[] {
    return [...this.db.getData().dictionary];
  }

  public add(entry: Omit<DictionaryEntry, 'id' | 'createdAt' | 'updatedAt'>): DictionaryEntry {
    const id = `dict-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const newEntry: DictionaryEntry = {
      ...entry,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.db.updateData(data => {
      data.dictionary.unshift(newEntry);
    });

    return newEntry;
  }

  public update(id: string, updates: Partial<Omit<DictionaryEntry, 'id' | 'createdAt'>>): DictionaryEntry | undefined {
    let updated: DictionaryEntry | undefined;

    this.db.updateData(data => {
      const idx = data.dictionary.findIndex(d => d.id === id);
      if (idx !== -1) {
        data.dictionary[idx] = {
          ...data.dictionary[idx],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        updated = data.dictionary[idx];
      }
    });

    return updated;
  }

  public delete(id: string): boolean {
    let deleted = false;
    this.db.updateData(data => {
      const initLen = data.dictionary.length;
      data.dictionary = data.dictionary.filter(d => d.id !== id);
      deleted = data.dictionary.length < initLen;
    });
    return deleted;
  }
}
