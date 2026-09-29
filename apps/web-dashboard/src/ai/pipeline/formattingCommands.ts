/**
 * Spoken Formatting Commands Processor for HRKVoice
 * Converts spoken layout directives into typography and Markdown structures.
 */

export interface FormattingCommandsResult {
  formattedText: string;
  appliedCommands: string[];
}

export function processFormattingCommands(text: string): FormattingCommandsResult {
  if (!text) return { formattedText: '', appliedCommands: [] };

  let current = text;
  const applied: string[] = [];

  const commandRules: { pattern: RegExp; replacement: string; name: string }[] = [
    { pattern: /\b(new paragraph|double enter)\b/gi, replacement: '\n\n', name: 'new-paragraph' },
    { pattern: /\b(new line|enter)\b/gi, replacement: '\n', name: 'new-line' },
    { pattern: /\b(bullet point|new bullet)\b/gi, replacement: '\n• ', name: 'bullet-point' },
    { pattern: /\b(number one|number 1)\b/gi, replacement: '\n1. ', name: 'numbered-list' },
    { pattern: /\b(number two|number 2)\b/gi, replacement: '\n2. ', name: 'numbered-list' },
    { pattern: /\b(number three|number 3)\b/gi, replacement: '\n3. ', name: 'numbered-list' },
    { pattern: /\b(full stop|period)\b/gi, replacement: '.', name: 'full-stop' },
    { pattern: /\b(comma)\b/gi, replacement: ',', name: 'comma' },
    { pattern: /\b(question mark)\b/gi, replacement: '?', name: 'question-mark' },
    { pattern: /\b(exclamation mark|exclamation point)\b/gi, replacement: '!', name: 'exclamation' },
    { pattern: /\b(colon)\b/gi, replacement: ':', name: 'colon' },
    { pattern: /\b(semicolon)\b/gi, replacement: ';', name: 'semicolon' },
    { pattern: /\b(open bracket|open parenthesis)\b/gi, replacement: '(', name: 'open-bracket' },
    { pattern: /\b(close bracket|close parenthesis)\b/gi, replacement: ')', name: 'close-bracket' },
    { pattern: /\b(open quote)\b/gi, replacement: '"', name: 'open-quote' },
    { pattern: /\b(close quote)\b/gi, replacement: '"', name: 'close-quote' },
    { pattern: /\b(code block)\b/gi, replacement: '\n```\n', name: 'code-block' },
    { pattern: /\b(heading)\b/gi, replacement: '\n### ', name: 'heading' }
  ];

  for (const rule of commandRules) {
    if (rule.pattern.test(current)) {
      applied.push(rule.name);
      current = current.replace(rule.pattern, rule.replacement);
    }
  }

  // Fix spacing around inserted punctuation (do not break tech names like node.js)
  current = current
    .replace(/\s+([.,!?:;)])/g, '$1')
    .replace(/([(])\s+/g, '$1')
    .replace(/([,!?:;])(?=[A-Za-z\u0900-\u0D7F])/g, '$1 ')
    .replace(/(\.)(?=[A-Z\u0900-\u0D7F])/g, '$1 ');

  return {
    formattedText: current.trim(),
    appliedCommands: applied
  };
}
