/**
 * Intelligent Filler Word Removal for HRKVoice
 * Distinguishes meaningless hesitation from meaningful usage.
 */

export interface FillerRemovalResult {
  cleanedText: string;
  fillersRemovedCount: number;
}

const HESITATION_TOKENS = [
  'um', 'uh', 'uhm', 'umm', 'er', 'ah', 'hmm', 'hm'
];

const COLLOQUIAL_FILLERS = [
  'you know',
  'sort of',
  'kind of',
  'i mean'
];

const INDIAN_FILLERS = [
  'woh kya bolte hai',
  'wo kya bolte hai',
  'matlab',
  'arre'
];

export function removeFillerWords(text: string): FillerRemovalResult {
  if (!text) return { cleanedText: '', fillersRemovedCount: 0 };

  let current = text;
  let count = 0;

  // 1. Remove pure vocal hesitations (um, uh, er, etc.) surrounded by word boundaries or punctuation
  for (const token of HESITATION_TOKENS) {
    const regex = new RegExp(`\\b${token}\\b[,\\s]*`, 'gi');
    const matches = current.match(regex);
    if (matches) {
      count += matches.length;
      current = current.replace(regex, '');
    }
  }

  // 2. Remove Indian multi-word fillers
  for (const filler of INDIAN_FILLERS) {
    const regex = new RegExp(`\\b${filler}\\b[,\\s]*`, 'gi');
    const matches = current.match(regex);
    if (matches) {
      count += matches.length;
      current = current.replace(regex, '');
    }
  }

  // 3. Remove conversational fillers (you know, etc.) when offset by commas or at start/end
  for (const filler of COLLOQUIAL_FILLERS) {
    const regex = new RegExp(`(^|[,\\s])\\b${filler}\\b([,\\s]|$)`, 'gi');
    const matches = current.match(regex);
    if (matches) {
      count += matches.length;
      current = current.replace(regex, ' ');
    }
  }

  // 4. Intelligent contextual check: remove standalone "basically" or "actually" ONLY when at the beginning of sentence
  const sentenceStartFillerRegex = /^(\s*(basically|actually|literally)\s*,\s*|\s*(basically|actually|literally)\s+)/i;
  if (sentenceStartFillerRegex.test(current)) {
    // Only remove if not part of "I actually need"
    current = current.replace(sentenceStartFillerRegex, '');
    count++;
  }

  // Clean double spaces and lingering misplaced punctuation
  current = current
    .replace(/[ ]{2,}/g, ' ')
    .replace(/^[,\s]+/, '')
    .replace(/[,\s]+$/, '')
    .trim();

  return {
    cleanedText: current,
    fillersRemovedCount: count
  };
}
