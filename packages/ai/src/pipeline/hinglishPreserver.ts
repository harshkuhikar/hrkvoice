/**
 * Hinglish & Code-Switching Technical Vocabulary Preserver for HRKVoice
 * Ensures technical terms and natural Indian code-switching phrases are preserved accurately.
 */

import { TECHNICAL_DICTIONARY_PRESERVE } from '@hrkvoice/shared';

export interface PreservationResult {
  text: string;
  preservedTerms: string[];
}

export function preserveTechnicalAndCodeSwitching(text: string): PreservationResult {
  if (!text) return { text: '', preservedTerms: [] };

  let current = text;
  const preserved: string[] = [];

  for (const term of TECHNICAL_DICTIONARY_PRESERVE) {
    // Case-insensitive regex matching whole word boundaries
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

    if (regex.test(current)) {
      current = current.replace(regex, term);
      preserved.push(term);
    }
  }

  // Ensure CLI package names remain lowercase (e.g. npm install react-router-dom)
  current = current.replace(/\b(npm\s+i(?:nstall)?|yarn\s+add|pnpm\s+add)\s+([^\n.]+)/gi, (_, cmd, rest) => {
    return `${cmd} ${rest.toLowerCase()}`;
  });

  return {
    text: current,
    preservedTerms: Array.from(new Set(preserved))
  };
}
