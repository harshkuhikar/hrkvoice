/**
 * Frequently Asked Questions Section for HRKVoice Landing Page
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: 'Which operating systems are currently supported?',
      a: 'The first release of HRKVoice is optimized specifically for Windows 10 and Windows 11 (64-bit). The architecture is cross-platform ready with macOS support planned next.'
    },
    {
      q: 'How does Hinglish and multilingual code-switching work?',
      a: 'HRKVoice is designed with a specialized language registry and technical vocabulary preserver. If you speak "kal client ko React project ka demo bhejna hai", it preserves the Hindi words and exact casing of React, client, and demo without forcing awkward English translations.'
    },
    {
      q: 'Is my raw audio stored on servers or locally?',
      a: 'Never. HRKVoice enforces a strict Zero Raw Audio Retention policy. Audio data exists in volatile memory only while being transcribed and is immediately discarded. Transcripts are optionally stored in an encrypted local database on your PC.'
    },
    {
      q: 'Can I use my own OpenAI, Groq, or Gemini API keys?',
      a: 'Yes! HRKVoice is completely provider-agnostic. You can input your personal API keys for Groq, OpenAI, Gemini, Anthropic, Deepgram, or Google Cloud in Settings. A local offline demo engine is also included.'
    },
    {
      q: 'Does it work across all Windows applications?',
      a: 'Yes. HRKVoice simulates native OS paste events with automatic clipboard preservation, so it works anywhere you can type — including VS Code, Cursor, Chrome, Edge, Slack, WhatsApp, Notion, Microsoft Word, and Terminal.'
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-6 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-sm">
          Everything you need to know about HRKVoice architecture and usage.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
