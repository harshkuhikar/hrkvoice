/**
 * Main Application Component for HRKVoice Desktop Renderer
 */

import React, { useState, useEffect } from 'react';
import { useHrkVoice } from './hooks/useHrkVoice';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Scratchpad } from './components/Scratchpad';
import { LanguagesView } from './components/LanguagesView';
import { ModesView } from './components/ModesView';
import { DictionaryView } from './components/DictionaryView';
import { SnippetsView } from './components/SnippetsView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { PrivacyCenter } from './components/PrivacyCenter';
import { FloatingBar } from './components/FloatingBar';
import { OnboardingModal } from './components/OnboardingModal';

export const App: React.FC = () => {
  const isFloatingBar = window.location.hash === '#floating-bar';
  const { settings, usage, activeView, setActiveView, isLoading } = useHrkVoice();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initialScratchpadText, setInitialScratchpadText] = useState<string>('');

  useEffect(() => {
    if (window.hrkVoice?.onNavigateTo) {
      const unbind = window.hrkVoice.onNavigateTo((view) => {
        setActiveView(view);
      });
      return () => unbind();
    }
  }, [setActiveView]);

  useEffect(() => {
    if (window.hrkVoice?.onDictationCompleted) {
      const unbind = window.hrkVoice.onDictationCompleted((data) => {
        if (data.view) setActiveView(data.view);
        if (data.text) setInitialScratchpadText(data.text);
      });
      return () => unbind();
    }
  }, [setActiveView]);

  useEffect(() => {
    if (!isLoading && settings && settings.onboardingCompleted === false && !isFloatingBar) {
      setShowOnboarding(true);
    }
  }, [isLoading, settings, isFloatingBar]);

  // If this window instance is the floating bar pill, render FloatingBar only
  if (isFloatingBar) {
    return <FloatingBar />;
  }

  return (
    <div className="flex h-screen w-screen bg-charcoal-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Navbar
        activeView={activeView}
        onSelectView={setActiveView}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-charcoal-950 overflow-hidden relative">
        {activeView === 'dashboard' && (
          <Dashboard usage={usage} settings={settings} onNavigate={setActiveView} />
        )}
        {activeView === 'scratchpad' && <Scratchpad initialText={initialScratchpadText} />}
        {activeView === 'languages' && <LanguagesView />}
        {activeView === 'modes' && <ModesView />}
        {activeView === 'dictionary' && <DictionaryView />}
        {activeView === 'snippets' && <SnippetsView />}
        {activeView === 'history' && <HistoryView />}
        {activeView === 'privacy' && <PrivacyCenter />}
        {activeView === 'settings' && <SettingsView />}

        {/* First Launch Onboarding Wizard */}
        {showOnboarding && (
          <OnboardingModal onComplete={() => setShowOnboarding(false)} />
        )}
      </main>
    </div>
  );
};
