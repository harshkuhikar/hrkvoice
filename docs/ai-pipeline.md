# HRKVoice — AI Text Processing Pipeline

The HRKVoice AI Processing Engine executes a multi-stage sequential pipeline designed to preserve user intent, remove speech hesitations, repair self-corrections, and format the output according to the active writing mode.

---

## Pipeline Execution Stages

```
   [ Raw Spoken Transcript ]
              │
              ▼
   Stage 1: Normalization (Whitespace, control characters)
              │
              ▼
   Stage 2: Spoken Command Detection (Cancel, Copy, Rewrite directives)
              │
              ▼
   Stage 3: Self-Correction Repair ("X, actually Y", "X, no wait Y", "X ko nahi Y ko")
              │
              ▼
   Stage 4: Intelligent Filler Removal (Hesitations like um, uh, er, matlab)
              │
              ▼
   Stage 5: Spoken Formatting Commands ("new paragraph", "bullet point", "colon")
              │
              ▼
   Stage 6: Personal Dictionary Biasing (Fuzzy vocabulary and pronunciation substitution)
              │
              ▼
   Stage 7: Snippet Expansion (Voice trigger phrases -> multi-line templates)
              │
              ▼
   Stage 8: Writing Mode Styling (Email, Chat, Developer, AI Prompt, Notes)
              │
              ▼
   Stage 9: Hinglish & Technical Vocabulary Preservation (React, Node.js, API)
              │
              ▼
   Stage 10: Sentence Capitalization & Script Polish
              │
              ▼
     [ Polished Final Text ]
```

---

## 1. Speech Self-Correction Engine

Natural human speech frequently contains repairs when the speaker changes their mind mid-sentence:
- **Spoken**: *"send it to Rahul, actually Rohit tomorrow morning"*
- **Pipeline Output**: *"Send it to Rohit tomorrow morning."*

The repair engine replaces discarded clauses while preserving sentence prepositions and overall grammatical flow.

## 2. Intelligent Filler Removal

Unlike naive text strippers that delete words indiscriminately:
- Standalone hesitations (*um*, *uh*, *er*, *hmm*) are stripped.
- Words with dual functions like *actually* or *basically* are analyzed contextually. *"I actually need the proposal"* preserves *actually*, whereas *"Actually, send the file"* removes the hesitation.
- Common Indian conversational fillers (*matlab*, *woh kya bolte hai*) are cleanly excised.

## 3. Dedicated Writing Modes

| Mode | Target Context | Typical Transformations |
|------|----------------|-------------------------|
| **General** | Universal | Punctuation, capitalization, clean flow |
| **Email** | Outlook, Gmail, Mail | Auto greeting ("Hi [Name],"), paragraphs, sign-off ("Thanks.") |
| **Chat** | Slack, WhatsApp, Teams | Natural, concise, conversational flow |
| **Professional** | Executive proposals | Polished corporate business tone |
| **Casual** | Friendly messages | Relaxed, authentic voice |
| **Developer** | VS Code, Cursor, Terminals | PascalCase components, camelCase hooks, CLI commands |
| **AI Prompt** | ChatGPT, Claude, Gemini | High-clarity structured task & requirement prompts |
| **Notes** | Notion, Word, OneNote | Bullet points and key takeaways |
