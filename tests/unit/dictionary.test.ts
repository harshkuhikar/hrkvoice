import { describe, it, expect } from 'vitest';
import { DictionaryManager } from '../../packages/dictionary/src/DictionaryManager';

describe('Dictionary Manager Unit Tests', () => {
  it('should initialize with default technical terms', () => {
    const manager = new DictionaryManager();
    const all = manager.getAll();
    expect(all.length).toBeGreaterThan(0);
    expect(all.some(e => e.preferredSpelling === 'Senaptiq')).toBe(true);
    expect(all.some(e => e.preferredSpelling === 'GSAP')).toBe(true);
  });

  it('should add, search, and delete entries', () => {
    const manager = new DictionaryManager([]);
    const entry = manager.add({
      word: 'Scalezix',
      pronunciation: 'Scale-ziks',
      preferredSpelling: 'Scalezix',
      language: 'all',
      category: 'company',
      enabled: true
    });

    expect(entry.id).toBeTruthy();
    expect(manager.getAll().length).toBe(1);

    const searchRes = manager.search('scale');
    expect(searchRes.length).toBe(1);
    expect(searchRes[0].preferredSpelling).toBe('Scalezix');

    const deleted = manager.delete(entry.id);
    expect(deleted).toBe(true);
    expect(manager.getAll().length).toBe(0);
  });

  it('should export and import JSON correctly', () => {
    const manager = new DictionaryManager();
    const json = manager.exportToJSON();
    expect(typeof json).toBe('string');

    const newManager = new DictionaryManager([]);
    const res = newManager.importFromJSON(json);
    expect(res.imported).toBeGreaterThan(0);
    expect(newManager.getAll().length).toBe(res.imported);
  });

  it('should export and import CSV correctly', () => {
    const manager = new DictionaryManager();
    const csv = manager.exportToCSV();
    expect(csv).toContain('preferredSpelling');

    const newManager = new DictionaryManager([]);
    const res = newManager.importFromCSV(csv);
    expect(res.imported).toBeGreaterThan(0);
  });
});
