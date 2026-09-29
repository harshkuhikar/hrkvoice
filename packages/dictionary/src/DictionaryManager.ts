/**
 * Personal Dictionary & Domain Vocabulary Manager for HRKVoice
 */

import { DictionaryEntry, DictionaryCategory, INITIAL_DICTIONARY_ENTRIES } from '@hrkvoice/shared';

export class DictionaryManager {
  private entries: Map<string, DictionaryEntry> = new Map();

  constructor(initialEntries?: DictionaryEntry[]) {
    const list = initialEntries !== undefined ? initialEntries : INITIAL_DICTIONARY_ENTRIES;
    list.forEach(entry => this.entries.set(entry.id, { ...entry }));
  }

  public getAll(): DictionaryEntry[] {
    return Array.from(this.entries.values());
  }

  public getEnabled(): DictionaryEntry[] {
    return this.getAll().filter(e => e.enabled);
  }

  public getById(id: string): DictionaryEntry | undefined {
    return this.entries.get(id);
  }

  public add(entry: Omit<DictionaryEntry, 'id' | 'createdAt' | 'updatedAt'>): DictionaryEntry {
    const id = `dict-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();
    const newEntry: DictionaryEntry = {
      ...entry,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.entries.set(id, newEntry);
    return newEntry;
  }

  public update(id: string, updates: Partial<Omit<DictionaryEntry, 'id' | 'createdAt'>>): DictionaryEntry | undefined {
    const existing = this.entries.get(id);
    if (!existing) return undefined;
    const updated: DictionaryEntry = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.entries.set(id, updated);
    return updated;
  }

  public delete(id: string): boolean {
    return this.entries.delete(id);
  }

  public toggle(id: string): boolean {
    const existing = this.entries.get(id);
    if (!existing) return false;
    existing.enabled = !existing.enabled;
    existing.updatedAt = new Date().toISOString();
    return true;
  }

  public search(query: string, category?: DictionaryCategory): DictionaryEntry[] {
    const q = query.toLowerCase().trim();
    return this.getAll().filter(e => {
      if (category && e.category !== category) return false;
      if (!q) return true;
      return (
        e.word.toLowerCase().includes(q) ||
        (e.pronunciation && e.pronunciation.toLowerCase().includes(q)) ||
        e.preferredSpelling.toLowerCase().includes(q)
      );
    });
  }

  public getBiasingKeywords(language?: string): string[] {
    return this.getEnabled()
      .filter(e => e.language === 'all' || !language || e.language === language)
      .map(e => e.preferredSpelling);
  }

  public exportToJSON(): string {
    return JSON.stringify(this.getAll(), null, 2);
  }

  public importFromJSON(jsonString: string): { imported: number; errors: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) throw new Error('Expected JSON array');
      let count = 0;
      for (const item of parsed) {
        if (item.word && item.preferredSpelling) {
          this.add({
            word: item.word,
            pronunciation: item.pronunciation,
            preferredSpelling: item.preferredSpelling,
            language: item.language || 'all',
            category: item.category || 'personal',
            enabled: item.enabled !== false,
            notes: item.notes
          });
          count++;
        }
      }
      return { imported: count, errors: 0 };
    } catch {
      return { imported: 0, errors: 1 };
    }
  }

  public exportToCSV(): string {
    const headers = 'word,pronunciation,preferredSpelling,language,category,enabled\n';
    const rows = this.getAll().map(e =>
      `"${e.word}","${e.pronunciation || ''}","${e.preferredSpelling}","${e.language}","${e.category}","${e.enabled}"`
    ).join('\n');
    return headers + rows;
  }

  public importFromCSV(csvString: string): { imported: number; errors: number } {
    let count = 0;
    const lines = csvString.split('\n').filter(l => l.trim().length > 0);
    // skip header if present
    const startIndex = lines[0].toLowerCase().includes('preferredspelling') ? 1 : 0;
    for (let i = startIndex; i < lines.length; i++) {
      const match = lines[i].split(',').map(s => s.replace(/^"|"$/g, '').trim());
      if (match.length >= 3) {
        this.add({
          word: match[0],
          pronunciation: match[1] || undefined,
          preferredSpelling: match[2],
          language: match[3] || 'all',
          category: (match[4] as DictionaryCategory) || 'personal',
          enabled: match[5] !== 'false'
        });
        count++;
      }
    }
    return { imported: count, errors: 0 };
  }
}
