/**
 * Spoken Commands Detector for HRKVoice
 * Identifies spoken productivity commands and differentiates them from continuous dictation.
 */

export type SpokenCommandType =
  | 'cancel'
  | 'copy'
  | 'translate_en'
  | 'make_professional'
  | 'make_shorter'
  | 'make_casual'
  | 'convert_bullets'
  | 'none';

export interface SpokenCommandCheck {
  isCommand: boolean;
  commandType: SpokenCommandType;
  remainingText: string;
}

export function detectSpokenCommand(transcript: string): SpokenCommandCheck {
  if (!transcript) return { isCommand: false, commandType: 'none', remainingText: '' };

  const trimmed = transcript.trim().toLowerCase();

  // Cancel / Discard
  if (/^(cancel|discard|cancel recording|discard that)$/i.test(trimmed)) {
    return { isCommand: true, commandType: 'cancel', remainingText: '' };
  }

  // Copy to clipboard
  if (/^(copy that|copy to clipboard|copy)$/i.test(trimmed)) {
    return { isCommand: true, commandType: 'copy', remainingText: '' };
  }

  // Rewrite directives
  if (/^(make this professional|make that professional|make it professional)$/i.test(trimmed)) {
    return { isCommand: true, commandType: 'make_professional', remainingText: '' };
  }

  if (/^(make this shorter|make that shorter|shorten this|keep it short)$/i.test(trimmed)) {
    return { isCommand: true, commandType: 'make_shorter', remainingText: '' };
  }

  if (/^(make this casual|make that casual|casual tone)$/i.test(trimmed)) {
    return { isCommand: true, commandType: 'make_casual', remainingText: '' };
  }

  if (/^(translate this to english|translate to english)$/i.test(trimmed)) {
    return { isCommand: true, commandType: 'translate_en', remainingText: '' };
  }

  return { isCommand: false, commandType: 'none', remainingText: transcript };
}
