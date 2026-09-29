/**
 * Pricing Architecture Section for HRKVoice Landing Page
 */

import React from 'react';
import { Check, Sparkles } from 'lucide-react';

export interface PricingTier {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export const PricingSection: React.FC<{
  onSelectTier: (tier: PricingTier) => void;
  onDownloadClick: () => void;
}> = ({ onSelectTier, onDownloadClick }) => {
  const tiers: PricingTier[] = [
    {
      name: 'Local Community',
      price: '₹0',
      period: 'Forever Free',
      desc: 'Completely offline and private. Bring your own free Groq key or use local engine.',
      features: [
        'Unlimited voice dictation',
        'All 23 Indian languages supported',
        'Global Windows shortcut (Ctrl+Alt+Space)',
        'Personal vocabulary dictionary',
        'Zero audio saved on servers',
        'Groq Whisper Large-v3 BYOK connector'
      ],
      cta: 'Download Free App',
      popular: false
    },
    {
      name: 'Pro Creator & Business',
      price: '₹499',
      period: 'per month',
      desc: 'Turnkey high-speed cloud transcription with sub-300ms latency and smart self-correction.',
      features: [
        'Everything in Free Community',
        'Managed high-speed Groq Whisper Large-v3',
        'Ultra-fast Llama 3.3 70B AI cleanup',
        'Currency & Hindi/Gujarati script normalization',
        'Advanced Developer & AI Prompt modes',
        'Priority updates & instant license key'
      ],
      cta: 'Get Pro License',
      popular: false
    },
    {
      name: 'Lifetime Founder Pass',
      price: '₹4,999',
      period: 'one-time payment',
      desc: 'Pay once, own forever. The ultimate commercial license with zero monthly fees.',
      features: [
        'Lifetime unlimited voice dictation',
        'Full Whisper Large-v3 & Llama 70B access',
        'Commercial use & Indian GST invoice ready',
        'Zero monthly subscription fees',
        'All future v2.0 & v3.0 updates included',
        'Dedicated VIP support'
      ],
      cta: 'Get Lifetime License',
      popular: true
    }
  ];

  return (
    <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-xs font-semibold text-brand-light">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>India-First Transparent Pricing</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Simple Pricing to Boost Your Daily Output
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Use completely free with your own API keys, or get an instant commercial license with managed cloud infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, idx) => (
          <div
            key={idx}
            className={`glass-panel p-8 rounded-3xl border flex flex-col justify-between space-y-6 relative transition-all hover:scale-[1.02] ${
              tier.popular
                ? 'border-brand ring-2 ring-brand/50 bg-gradient-to-b from-charcoal-900 via-charcoal-850 to-charcoal-900 shadow-2xl shadow-brand/20'
                : 'border-white/10 bg-charcoal-900/90'
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-brand to-indigo-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg">
                ★ Best Value & Popular
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{tier.desc}</p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                <span className="text-xs text-slate-400 font-medium">/ {tier.period}</span>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-white/5 text-xs text-slate-300">
                {tier.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                if (tier.price === '₹0') {
                  onDownloadClick();
                } else {
                  onSelectTier(tier);
                }
              }}
              className={`w-full py-3.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                tier.popular
                  ? 'bg-brand hover:bg-brand-hover text-white shadow-brand/30 hover:shadow-brand/50'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
