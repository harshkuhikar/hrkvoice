/**
 * Core Text Processing Pipeline for HRKVoice
 * Fully local deterministic execution layer for formatting, self-corrections,
 * filler removal, dictionary biasing, and writing mode styling.
 */

import { ProcessingResult, WritingMode, DictionaryEntry, Snippet, ContextInfo } from '@hrkvoice/shared';
import { normalizeTranscript } from './normalizer';
import { removeFillerWords } from './fillerRemover';
import { applySelfCorrection } from './selfCorrection';
import { processFormattingCommands } from './formattingCommands';
import { DeveloperFormatter } from './developerFormatter';
import { preserveTechnicalAndCodeSwitching } from './hinglishPreserver';
import { detectSpokenCommand, SpokenCommandType } from './spokenCommands';
import { IndianScriptProcessor } from './indianScriptProcessor';

export interface PipelineOptions {
  mode?: WritingMode;
  sourceLanguage?: string;
  targetLanguage?: string;
  context?: ContextInfo;
  userDictionary?: DictionaryEntry[];
  snippets?: Snippet[];
  enableFillerRemoval?: boolean;
  enableSelfCorrection?: boolean;
  enableFormatting?: boolean;
  preserveCodeSwitching?: boolean;
}

export class TextProcessingPipeline {
  /**
   * Run the full multi-stage processing pipeline on a raw transcript
   */
  public static execute(rawTranscript: string, options: PipelineOptions = {}): ProcessingResult {
    const startTime = Date.now();
    const mode = options.mode || 'general';
    const enableFillers = options.enableFillerRemoval !== false;
    const enableSelfCorrectionFlag = options.enableSelfCorrection !== false;
    const enableFormattingFlag = options.enableFormatting !== false;

    let current = rawTranscript || '';
    const appliedTransformations: ProcessingResult['appliedTransformations'] = {
      fillersRemoved: 0,
      selfCorrectionsApplied: 0,
      dictionaryReplacements: 0,
      snippetsExpanded: 0,
      formattingApplied: [],
      technicalTermsPreserved: []
    };

    // Stage 1: Normalization
    current = normalizeTranscript(current);

    // Stage 2: Check Spoken Commands
    const commandCheck = detectSpokenCommand(current);
    if (commandCheck.isCommand && commandCheck.commandType === 'cancel') {
      return {
        rawTranscript,
        finalText: '',
        detectedLanguage: options.sourceLanguage || 'en',
        confidence: 1.0,
        durationMs: Date.now() - startTime,
        wordsCount: 0,
        detectedMode: mode,
        warnings: ['Spoken command "cancel" triggered - output discarded.'],
        appliedTransformations
      };
    }

    // Stage 3: Self-Correction Detection
    if (enableSelfCorrectionFlag) {
      const scRes = applySelfCorrection(current);
      current = scRes.correctedText;
      appliedTransformations.selfCorrectionsApplied = scRes.selfCorrectionsAppliedCount;
    }

    // Stage 4: Filler Removal
    if (enableFillers) {
      const frRes = removeFillerWords(current);
      current = frRes.cleanedText;
      appliedTransformations.fillersRemoved = frRes.fillersRemovedCount;
    }

    // Stage 4.5: Deep Native Indian Script Intelligence (Gujarati, Hindi, Tamil, Telugu, etc.)
    const indianRes = IndianScriptProcessor.process(current);
    current = indianRes.text;
    appliedTransformations.selfCorrectionsApplied += indianRes.selfCorrectionsCount;
    appliedTransformations.fillersRemoved += indianRes.fillersCount;

    // Stage 5: Spoken Formatting Directives ("new paragraph", "bullet point", etc.)
    if (enableFormattingFlag) {
      const fmtRes = processFormattingCommands(current);
      current = fmtRes.formattedText;
      appliedTransformations.formattingApplied = fmtRes.appliedCommands;
    }

    // Stage 6: Personal Dictionary Replacements
    if (options.userDictionary && options.userDictionary.length > 0) {
      for (const entry of options.userDictionary) {
        if (!entry.enabled) continue;
        const targetWords = [entry.word];
        if (entry.pronunciation) {
          targetWords.push(entry.pronunciation);
        }

        for (const target of targetWords) {
          const esc = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const dictRegex = new RegExp(`\\b${esc}\\b`, 'gi');
          if (dictRegex.test(current)) {
            current = current.replace(dictRegex, entry.preferredSpelling);
            appliedTransformations.dictionaryReplacements++;
          }
        }
      }
    }

    // Stage 7: Snippets Expansion
    if (options.snippets && options.snippets.length > 0) {
      for (const snip of options.snippets) {
        if (!snip.enabled) continue;
        const esc = snip.trigger.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const snipRegex = new RegExp(`^${esc}$|\\b${esc}\\b`, 'i');
        if (snipRegex.test(current.trim())) {
          current = current.replace(snipRegex, snip.content);
          appliedTransformations.snippetsExpanded++;
          break; // First matching snippet wins
        }
      }
    }

    // Stage 8: Mode-Specific Formatting
    if (mode === 'developer') {
      const devRes = DeveloperFormatter.formatDeveloperSpeech(current);
      current = devRes.formatted;
    } else if (mode === 'email') {
      current = this.applyEmailStyling(current);
    } else if (mode === 'chat') {
      current = this.applyChatStyling(current);
    } else if (mode === 'notes') {
      current = this.applyNotesStyling(current);
    } else if (mode === 'prompt') {
      current = this.applyPromptStyling(current);
    }

    // Stage 9: Hinglish and Technical Terms Preservation
    const techRes = preserveTechnicalAndCodeSwitching(current);
    current = techRes.text;
    appliedTransformations.technicalTermsPreserved = techRes.preservedTerms;

    // Stage 10: Final Punctuation & Capitalization Polish
    current = this.applyFinalPolish(current);

    const words = current.trim() ? current.trim().split(/\s+/).length : 0;

    return {
      rawTranscript,
      finalText: current,
      detectedLanguage: options.sourceLanguage || 'en',
      confidence: 0.98,
      durationMs: Date.now() - startTime,
      wordsCount: words,
      detectedMode: mode,
      appliedTransformations
    };
  }

  private static applyEmailStyling(text: string): string {
    let t = text.trim();
    // Check if greeting is present
    if (!/^(hi|hello|dear|hey|good\s+(morning|afternoon|evening))\b/i.test(t)) {
      t = `Hi,\n\n${t}`;
    } else {
      // Put newline after greeting with proper capitalization
      t = t.replace(/^(hi|hello|dear|hey)\s+([a-zA-Z\u0900-\u0D7F]+)[,\s]*/i, (_, g, name) => {
        const capGreeting = g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
        const capName = name.charAt(0).toUpperCase() + name.slice(1);
        return `${capGreeting} ${capName},\n\n`;
      });
    }

    // Check if closing is present
    if (!/(thanks|regards|best|sincerely)/i.test(t)) {
      t = `${t}\n\nThanks.`;
    }
    return t;
  }

  private static applyChatStyling(text: string): string {
    // Keep it crisp and direct
    return text.trim();
  }

  private static applyNotesStyling(text: string): string {
    const sentences = text.split(/(?<=[.?!])\s+/);
    if (sentences.length > 1) {
      return sentences.map(s => `• ${s.trim()}`).join('\n');
    }
    return `• ${text.trim()}`;
  }

  private static applyPromptStyling(text: string): string {
    return `Task:\n${text.trim()}\n\nRequirements:\n- Maintain high quality and adhere to modern best practices\n- Provide structured, production-ready output`;
  }

  private static applyFinalPolish(text: string): string {
    if (!text) return '';
    let result = text.trim();

    // Capitalize first character if Latin
    if (/^[a-z]/.test(result)) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    // Ensure sentence ending punctuation if it doesn't end in code block, punctuation, or newline
    if (!/[.?!:;\n`]$/.test(result) && !result.includes('\n')) {
      result += '.';
    }

    return result;
  }
}
