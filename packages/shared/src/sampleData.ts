/**
 * Seed Dictionary and Snippets Data for HRKVoice
 */

import { DictionaryEntry, Snippet } from './types';

export const INITIAL_DICTIONARY_ENTRIES: DictionaryEntry[] = [
  {
    id: 'dict-1',
    word: 'Senaptech',
    pronunciation: 'Sen-ap-tik',
    preferredSpelling: 'Senaptiq',
    language: 'all',
    category: 'company',
    enabled: true,
    notes: 'Company brand name',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dict-2',
    word: 'Vanaari',
    pronunciation: 'Vuh-naa-ree',
    preferredSpelling: 'Vanaari',
    language: 'all',
    category: 'company',
    enabled: true,
    notes: 'Company brand name',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dict-3',
    word: 'Scalezix',
    pronunciation: 'Scale-ziks',
    preferredSpelling: 'Scalezix',
    language: 'all',
    category: 'company',
    enabled: true,
    notes: 'Venture portfolio',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dict-4',
    word: 'Qubeta',
    pronunciation: 'Kyoo-beta',
    preferredSpelling: 'Qubeta',
    language: 'all',
    category: 'company',
    enabled: true,
    notes: 'Platform name',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dict-5',
    word: 'GSAP',
    pronunciation: 'Gee-sap',
    preferredSpelling: 'GSAP',
    language: 'en',
    category: 'developer',
    enabled: true,
    notes: 'GreenSock Animation Platform',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'dict-6',
    word: 'HRKVoice',
    pronunciation: 'H-R-K-Voice',
    preferredSpelling: 'HRKVoice',
    language: 'all',
    category: 'personal',
    enabled: true,
    notes: 'Product name',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 'snip-1',
    trigger: 'my email',
    title: 'Professional Email Signature',
    content: 'Best regards,\nOmkar Sharma | Senior Architect\nHRKVoice Technologies\ncontact@hrkvoice.internal',
    category: 'email',
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'snip-2',
    trigger: 'meeting intro',
    title: 'Standup / Sync Kickoff',
    content: 'Thanks everyone for joining. Today\'s agenda covers key blockers, sprint progress, and release timelines for the upcoming milestone.',
    category: 'work',
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'snip-3',
    trigger: 'pr template',
    title: 'Pull Request Template',
    content: '## Summary\n- Implemented voice pipeline\n- Added Indian languages test suite\n\n## Verification\n- Tested on Windows 11\n- Automated unit tests passing',
    category: 'developer',
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
