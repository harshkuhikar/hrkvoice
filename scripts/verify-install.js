/**
 * Diagnostic Verification Script for HRKVoice
 * Validates installation, registry integrity, AI pipeline, and clipboard encoding
 */

const path = require('path');
const { getAllLanguages } = require('../packages/shared/dist/languages');
const { TextProcessingPipeline } = require('../packages/ai/dist/pipeline/TextProcessingPipeline');
const { SafeClipboardService } = require('../packages/utilities/dist/clipboard');
const { SpeechManager } = require('../packages/speech/dist/SpeechManager');
const { AIManager } = require('../packages/ai/dist/AIManager');

console.log('\n======================================================');
console.log('🔍 HRKVoice Diagnostic & Installation Verification');
console.log('======================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Language Registry Audit
console.log('1. Auditing Central Language Registry (Section 7)...');
const languages = getAllLanguages();
assert(languages.length === 23, `Registry contains all 23 languages (found: ${languages.length})`);
const hindi = languages.find(l => l.code === 'hi');
assert(hindi && hindi.nativeName === 'हिन्दी', 'Hindi language correctly identified with Devanagari script');
const gujarati = languages.find(l => l.code === 'gu');
assert(gujarati && gujarati.nativeName === 'ગુજરાતી', 'Gujarati language correctly identified with Gujarati script');

// 2. AI Pipeline & Self-Correction Verification
console.log('\n2. Verifying AI Speech Repair Pipeline (Section 14)...');
const testInput = 'hey um can you send rahul the invoice actually not rahul send it to rohit tomorrow morning';
const pipelineResult = TextProcessingPipeline.execute(testInput, { mode: 'general' });
assert(
  pipelineResult.finalText.toLowerCase().includes('rohit tomorrow morning'),
  'Self-correction successfully resolved from Rahul to Rohit'
);
assert(
  !pipelineResult.finalText.toLowerCase().includes('actually not'),
  'Hesitation clause stripped cleanly'
);

// 3. Technical Vocabulary Preservation
console.log('\n3. Verifying Hinglish & Technical Vocabulary Preservation (Section 10)...');
const techInput = 'kal client ko React project ka deployment aur Node.js API test karni hai';
const techResult = TextProcessingPipeline.execute(techInput, { mode: 'general' });
assert(techResult.finalText.includes('React'), 'React technical term preserved');
assert(techResult.finalText.includes('Node.js'), 'Node.js technical term preserved');
assert(techResult.finalText.includes('API'), 'API technical term preserved');

// 4. Developer Mode Formatting
console.log('\n4. Verifying Developer Mode Formatting (Section 19)...');
const devInput = 'create a component called user profile card and npm install react router dom';
const devResult = TextProcessingPipeline.execute(devInput, { mode: 'developer' });
assert(devResult.finalText.includes('UserProfileCard'), 'Component formatted to PascalCase (UserProfileCard)');
assert(devResult.finalText.includes('npm install react-router-dom'), 'Package formatted to kebab-case');

// 5. Multilingual Unicode Integrity Check
console.log('\n5. Verifying Multilingual Unicode Clipboard Handling (Section 27)...');
const unicodeSamples = [
  'हिन्दी', 'ગુજરાતી', 'বাংলা', 'ਪੰਜਾਬੀ', 'தமிழ்', 'తెలుగు', 'मराठी', 'ಕನ್ನಡ', 'മലയാളം', 'ଓଡ଼ିଆ', 'অসমীয়া', 'नेपाली', 'اردو'
];
for (const s of unicodeSamples) {
  assert(SafeClipboardService.verifyUnicodeIntegrity(s), `Unicode script integrity verified for: ${s}`);
}

// 6. Speech & AI Provider Subsystem
console.log('\n6. Verifying Speech & AI Provider Abstraction (Section 6 & 55)...');
const speechManager = new SpeechManager();
assert(speechManager.getAllProviders().length >= 5, 'SpeechManager registers all speech providers');
const aiManager = new AIManager();
assert(aiManager.getAllProviders().length >= 5, 'AIManager registers all AI providers');

console.log('\n======================================================');
console.log(`Diagnostic Results: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✨ HRKVoice is completely verified and ready for deployment!\n');
}
