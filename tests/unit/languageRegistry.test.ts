import { describe, it, expect } from 'vitest';
import {
  getAllLanguages,
  getLanguageByCode,
  getLanguageSupportForProvider,
  INDIAN_LANGUAGE_REGISTRY
} from '../../packages/shared/src/languages';

describe('Language Registry Unit Tests', () => {
  it('should contain all 22 official scheduled Indian languages plus English (23 total)', () => {
    const all = getAllLanguages();
    expect(all.length).toBe(23);

    const expectedCodes = [
      'en', 'hi', 'gu', 'bn', 'mr', 'ta', 'te', 'kn', 'ml', 'pa',
      'or', 'as', 'ur', 'sa', 'ne', 'kok', 'mai', 'doi', 'ks', 'sd',
      'mni', 'brx', 'sat'
    ];

    for (const code of expectedCodes) {
      expect(INDIAN_LANGUAGE_REGISTRY[code]).toBeDefined();
      expect(INDIAN_LANGUAGE_REGISTRY[code].displayName).toBeTruthy();
      expect(INDIAN_LANGUAGE_REGISTRY[code].nativeName).toBeTruthy();
      expect(INDIAN_LANGUAGE_REGISTRY[code].script).toBeTruthy();
    }
  });

  it('should retrieve a language definition by code case-insensitively', () => {
    const hindi = getLanguageByCode('HI');
    expect(hindi).toBeDefined();
    expect(hindi?.displayName).toBe('Hindi');
    expect(hindi?.nativeName).toBe('हिन्दी');
    expect(hindi?.script).toBe('Devanagari');

    const gujarati = getLanguageByCode('gu');
    expect(gujarati).toBeDefined();
    expect(gujarati?.displayName).toBe('Gujarati');
    expect(gujarati?.nativeName).toBe('ગુજરાતી');
  });

  it('should verify provider capability lookup', () => {
    const mockCheck = getLanguageSupportForProvider('hi', 'mock');
    expect(mockCheck.supported).toBe(true);

    const groqCheck = getLanguageSupportForProvider('hi', 'groq');
    expect(groqCheck.supported).toBe(true);
    expect(groqCheck.providerCode).toBe('hi');
  });

  it('should have complete sample phrases for every registered language (Section 64)', () => {
    const all = getAllLanguages();
    for (const lang of all) {
      expect(lang.samplePhrases.greeting).toBeTruthy();
      expect(lang.samplePhrases.business).toBeTruthy();
      expect(lang.samplePhrases.tech).toBeTruthy();
      expect(lang.samplePhrases.numbers).toBeTruthy();
    }
  });
});
