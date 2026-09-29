/**
 * Landing Page Root Application for HRKVoice
 */

import React, { useState } from 'react';
import { LandingHero } from './components/LandingHero';
import { InteractiveDemo } from './components/InteractiveDemo';
import { GlobalShortcutDemo } from './components/GlobalShortcutDemo';
import { FeatureGrid } from './components/FeatureGrid';
import { LanguageMatrix } from './components/LanguageMatrix';
import { DeveloperModeShowcase } from './components/DeveloperModeShowcase';
import { PricingSection, PricingTier } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { DownloadModal } from './components/DownloadModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { Download, Sparkles, Laptop, User, LogOut } from 'lucide-react';

export const App: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedCheckoutTier, setSelectedCheckoutTier] = useState<PricingTier | null>(null);

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-charcoal-950 text-slate-100 font-sans selection:bg-brand selection:text-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-indigo-700 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md shadow-brand/20">
              HRK
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">HRKVoice</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[10px] font-semibold">
                ● v1.0.0 Windows Ready
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#demo" className="hover:text-white transition-colors">Live Studio</a>
            <a href="#shortcut-demo" className="hover:text-white transition-colors">Ctrl+Alt+Space Demo</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#languages" className="hover:text-white transition-colors">23 Languages</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing & Licenses</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-charcoal-900 border border-white/10 text-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="font-bold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-emerald-400 font-medium">● {currentUser.plan.toUpperCase()}</div>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="ml-1 p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-brand-light" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-semibold text-xs shadow-md shadow-brand/25 transition-all hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <LandingHero
        onTryDemo={scrollToDemo}
        onDownloadClick={() => setShowDownloadModal(true)}
      />

      {/* Interactive In-Browser Studio & Playground */}
      <InteractiveDemo />

      {/* Interactive Global Shortcut Simulator (Ctrl+Alt+Space) */}
      <GlobalShortcutDemo onDownloadClick={() => setShowDownloadModal(true)} />

      {/* Core Features */}
      <FeatureGrid />

      {/* Developer Mode Showcase */}
      <DeveloperModeShowcase />

      {/* 23 Languages Matrix */}
      <LanguageMatrix />

      {/* Commercial Pricing Architecture & License Store */}
      <PricingSection
        onSelectTier={(tier) => setSelectedCheckoutTier(tier)}
        onDownloadClick={() => setShowDownloadModal(true)}
      />

      {/* FAQ */}
      <FaqSection />

      {/* Footer */}
      <Footer />

      {/* Windows Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />

      {/* Commercial License Checkout & Generator Modal */}
      <CheckoutModal
        isOpen={Boolean(selectedCheckoutTier)}
        onClose={() => setSelectedCheckoutTier(null)}
        tier={selectedCheckoutTier}
        onDownloadApp={() => setShowDownloadModal(true)}
      />
    </div>
  );
};
