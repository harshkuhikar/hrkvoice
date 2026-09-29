/**
 * Self-Correction Detection and Resolution for HRKVoice
 * Identifies speech repairs and overrides replaced clauses.
 */

export interface SelfCorrectionResult {
  correctedText: string;
  selfCorrectionsAppliedCount: number;
}

export function applySelfCorrection(text: string): SelfCorrectionResult {
  if (!text) return { correctedText: '', selfCorrectionsAppliedCount: 0 };

  let current = text;
  let count = 0;

  // Pattern 1: "... actually not [Subject/Object] [New replacement phrase] ..."
  // Example: "can you send rahul the invoice actually not rahul send it to rohit tomorrow morning"
  const notActuallyRegex = /(?:^|\s)(.*?)\s+(?:actually\s+not|wait\s+not|sorry\s+not)\s+([a-zA-Z\u0900-\u0D7F]+)\s+(.*)$/i;
  const match1 = current.match(notActuallyRegex);
  if (match1) {
    const prefix = match1[1].trim();
    const wrongTarget = match1[2].trim();
    const replacementClause = match1[3].trim();

    if (/^(send|give|forward|make|call|schedule|do|meet)\b/i.test(replacementClause)) {
      const wordsBefore = prefix.split(' ');
      const prefixWithoutTarget = wordsBefore.filter(w => w.toLowerCase() !== wrongTarget.toLowerCase()).join(' ');
      current = `${prefixWithoutTarget ? prefixWithoutTarget.replace(/\s+(it|the)\s*$/i, '') : ''} ${replacementClause}`.trim();
      count++;
    } else {
      current = `${prefix.replace(new RegExp(`\\b${wrongTarget}\\b`, 'i'), replacementClause)}`.trim();
      count++;
    }
  }

  // Pattern 2: "X, actually Y" or "X actually Y" (e.g. "Monday, actually Tuesday morning" -> "Tuesday morning", "send it to Rahul, actually Rohit" -> "send it to Rohit")
  const actuallyRegex = /\b(?:(to|at|for|on|in|from|with)\s+)?([a-zA-Z0-9\u0900-\u0D7F]+)[,\s]+(?:actually|in fact)\s+([a-zA-Z0-9\u0900-\u0D7F]+(?:\s+[a-zA-Z0-9\u0900-\u0D7F]+)*)/i;
  const match2 = current.match(actuallyRegex);
  if (match2 && !current.includes('actually need') && !current.includes('actually want')) {
    const preposition = match2[1] ? `${match2[1]} ` : '';
    const correctWord = match2[3];
    const fullMatch = match2[0];
    current = current.replace(fullMatch, `${preposition}${correctWord}`);
    count++;
  }

  // Pattern 3: "X, no sorry Y" or "X, no wait Y" or "X, sorry Y" (e.g. "meeting at five, no sorry six" -> "meeting at six")
  const noSorryRegex = /\b(?:(to|at|for|on|in|from|with)\s+)?([a-zA-Z0-9\u0900-\u0D7F]+)[,\s]+(?:no\s+sorry|no\s+wait|sorry\s+wait|no\s+I\s+mean|scratch\s+that)[,\s]+([a-zA-Z0-9\u0900-\u0D7F]+(?:\s+[a-zA-Z0-9\u0900-\u0D7F]+)*)/i;
  const match3 = current.match(noSorryRegex);
  if (match3) {
    const preposition = match3[1] ? `${match3[1]} ` : '';
    const correctWord = match3[3];
    current = current.replace(match3[0], `${preposition}${correctWord}`);
    count++;
  }

  // Pattern 4: Indian speech self-correction: "Rahul ko nahi Rohit ko"
  const hindiRepairRegex = /([a-zA-Z0-9\u0900-\u0D7F]+(?:\s+ko)?)[,\s]+(?:nahi|nahin|na)\s+(?:sorry\s+)?([a-zA-Z0-9\u0900-\u0D7F]+(?:\s+ko)?)/i;
  const match4 = current.match(hindiRepairRegex);
  if (match4) {
    current = current.replace(match4[0], match4[2]);
    count++;
  }

  return {
    correctedText: current.trim(),
    selfCorrectionsAppliedCount: count
  };
}
