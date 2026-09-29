/**
 * Settings Component for HRKVoice Desktop
 * Configures speech & AI providers, API keys, shortcuts, and writing options
 */

import React, { useState } from 'react';
import {
  Settings,
  Key,
  Mic,
  Sliders,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Keyboard,
  ClipboardPaste
} from 'lucide-react';
import { useHrkVoice } from '../hooks/useHrkVoice';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings } = useHrkVoice();
  const [activeTab, setActiveTab] = useState<'providers' | 'shortcuts' | 'ai' | 'insertion' | 'privacy'>('providers');
  const [testResult, setTestResult] = useState<{ id: string; status: 'testing' | 'success' | 'failed'; message?: string } | null>(null);

  // Local key input buffers
  const [keys, setKeys] = useState({
    groq: '',
    openai: '',
    gemini: '',
    anthropic: '',
    deepgram: '',
    google: ''
  });

  const handleSaveKeys = async () => {
    const updatedKeys: any = {};
    if (keys.groq) updatedKeys.groq = keys.groq;
    if (keys.openai) updatedKeys.openai = keys.openai;
    if (keys.gemini) updatedKeys.gemini = keys.gemini;
    if (keys.anthropic) updatedKeys.anthropic = keys.anthropic;
    if (keys.deepgram) updatedKeys.deepgram = keys.deepgram;
    if (keys.google) updatedKeys.google = keys.google;

    await updateSettings({
      apiKeys: {
        ...settings.apiKeys,
        ...updatedKeys
      }
    });
    alert('API keys updated successfully.');
  };

  const handleTestConnection = async (type: 'speech' | 'ai', providerId: string) => {
    setTestResult({ id: providerId, status: 'testing' });
    try {
      const res = await fetch('http://localhost:4321/api/settings/test-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, providerId })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult({ id: providerId, status: 'success', message: data.message || 'Connected successfully!' });
      } else {
        setTestResult({ id: providerId, status: 'failed', message: data.message || 'Connection failed' });
      }
    } catch (err: any) {
      setTestResult({ id: providerId, status: 'failed', message: err.message });
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-light" />
          <span>Application Settings</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure AI & Speech engines, shortcuts, privacy, and insertion behavior.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-xs font-semibold">
        {[
          { id: 'providers', label: 'Providers & API Keys', icon: Key },
          { id: 'shortcuts', label: 'Shortcuts & Recording', icon: Keyboard },
          { id: 'ai', label: 'AI Writing & Correction', icon: Sparkles },
          { id: 'insertion', label: 'Text Insertion', icon: ClipboardPaste },
          { id: 'privacy', label: 'Privacy & Context', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-brand text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROVIDERS & API KEYS */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          {/* Provider Selection */}
          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Engine Selection</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-semibold">Speech Recognition Provider</label>
                <select
                  value={settings.speechProvider}
                  onChange={(e) => updateSettings({ speechProvider: e.target.value as any })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                >
                  <option value="mock">Offline / Demo Engine (No API key needed)</option>
                  <option value="groq">Groq Whisper (Ultra Low Latency)</option>
                  <option value="openai">OpenAI Whisper</option>
                  <option value="deepgram">Deepgram Nova-2</option>
                  <option value="google">Google Cloud Speech</option>
                </select>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-semibold">AI Cleanup & Formatting Provider</label>
                <select
                  value={settings.aiProvider}
                  onChange={(e) => updateSettings({ aiProvider: e.target.value as any })}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand"
                >
                  <option value="mock">Offline Local NLP Engine (No API key needed)</option>
                  <option value="groq">Groq Llama 3.3 70B (Fastest)</option>
                  <option value="openai">OpenAI GPT-4o-mini</option>
                  <option value="gemini">Google Gemini 2.0 Flash</option>
                  <option value="anthropic">Anthropic Claude 3.5</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Key Management */}
          <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Provider API Keys</h2>
                <p className="text-xs text-slate-400 mt-0.5">Keys are encrypted on disk and never logged.</p>
              </div>
              <button
                onClick={handleSaveKeys}
                className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover text-xs font-semibold text-white shadow-md shadow-brand/25"
              >
                Save Keys
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { id: 'groq', label: 'Groq API Key (Whisper + Llama 3.3)', placeholder: 'gsk_...' },
                { id: 'openai', label: 'OpenAI API Key (Whisper + GPT-4o)', placeholder: 'sk-proj-...' },
                { id: 'gemini', label: 'Google Gemini API Key', placeholder: 'AIzaSy...' },
                { id: 'anthropic', label: 'Anthropic Claude API Key', placeholder: 'sk-ant-...' },
                { id: 'deepgram', label: 'Deepgram API Key', placeholder: 'Token...' }
              ].map(item => (
                <div key={item.id} className="p-3 rounded-lg bg-charcoal-800 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">{item.label}</span>
                    <button
                      onClick={() => handleTestConnection('speech', item.id)}
                      className="text-[11px] text-brand-light hover:text-white"
                    >
                      Test Connection
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder={item.placeholder}
                    value={(keys as any)[item.id]}
                    onChange={(e) => setKeys(prev => ({ ...prev, [item.id]: e.target.value }))}
                    className="w-full bg-charcoal-900 border border-white/10 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-brand"
                  />
                  {testResult && testResult.id === item.id && (
                    <div className={`text-[11px] flex items-center gap-1 ${
                      testResult.status === 'success' ? 'text-emerald-400' : testResult.status === 'failed' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {testResult.status === 'testing' && 'Testing connection...'}
                      {testResult.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {testResult.status === 'failed' && <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{testResult.message}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHORTCUTS & RECORDING */}
      {activeTab === 'shortcuts' && (
        <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-5 text-xs">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recording Shortcuts</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <div>
                <div className="font-semibold text-slate-200">Push-to-Talk Shortcut</div>
                <div className="text-slate-400 text-[11px]">Hold to record, release to insert into active app.</div>
              </div>
              <kbd className="px-2.5 py-1 rounded bg-charcoal-900 border border-white/10 text-white font-mono font-bold">
                {settings.pushToTalkShortcut}
              </kbd>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <div>
                <div className="font-semibold text-slate-200">Toggle Recording Shortcut</div>
                <div className="text-slate-400 text-[11px]">Press once to start, press again to stop and insert.</div>
              </div>
              <kbd className="px-2.5 py-1 rounded bg-charcoal-900 border border-white/10 text-white font-mono font-bold">
                {settings.toggleShortcut}
              </kbd>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-charcoal-800 border border-white/5">
              <div>
                <div className="font-semibold text-slate-200">Cancel Voice Capture</div>
                <div className="text-slate-400 text-[11px]">Discard recording without inserting text.</div>
              </div>
              <kbd className="px-2.5 py-1 rounded bg-charcoal-900 border border-white/10 text-white font-mono font-bold">
                Escape
              </kbd>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI WRITING & CORRECTION */}
      {activeTab === 'ai' && (
        <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">AI Speech Repair & Formatting</h2>

          <div className="space-y-3">
            {[
              {
                id: 'enableSelfCorrection',
                title: 'Speech Self-Correction',
                desc: 'Automatically resolves speech repairs (e.g. "send to Rahul, actually Rohit" -> "Send to Rohit").',
                val: settings.enableSelfCorrection
              },
              {
                id: 'enableFillerRemoval',
                title: 'Intelligent Filler Removal',
                desc: 'Cleans hesitations (um, uh, you know, matlab) without altering sentences where the word is meaningful.',
                val: settings.enableFillerRemoval
              },
              {
                id: 'preserveCodeSwitching',
                title: 'Hinglish & Code-Switching Preservation',
                desc: 'Preserves bilingual Indian speech and technical names without forcing unnecessary English translation.',
                val: settings.preserveCodeSwitching
              },
              {
                id: 'enableSpokenFormatting',
                title: 'Spoken Layout Directives',
                desc: 'Understands "new paragraph", "bullet point", "colon", "heading", and markdown syntax.',
                val: settings.enableSpokenFormatting
              }
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
                <div className="pr-4">
                  <div className="font-semibold text-slate-200">{item.title}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={item.val}
                  onChange={(e) => updateSettings({ [item.id]: e.target.checked } as any)}
                  className="w-4 h-4 rounded text-brand focus:ring-brand accent-brand cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TEXT INSERTION */}
      {activeTab === 'insertion' && (
        <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Text Insertion & Clipboard</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
              <div>
                <div className="font-semibold text-slate-200">Auto-Paste into Focused App</div>
                <div className="text-slate-400 text-[11px]">Automatically simulates paste shortcut in the active window.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoPaste}
                onChange={(e) => updateSettings({ autoPaste: e.target.checked })}
                className="w-4 h-4 rounded accent-brand"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
              <div>
                <div className="font-semibold text-slate-200">Preserve User Clipboard</div>
                <div className="text-slate-400 text-[11px]">Restores your prior copied content so HRKVoice doesn't wipe your clipboard.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.restoreClipboard}
                onChange={(e) => updateSettings({ restoreClipboard: e.target.checked })}
                className="w-4 h-4 rounded accent-brand"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PRIVACY & CONTEXT */}
      {activeTab === 'privacy' && (
        <div className="glass-panel p-6 rounded-xl border border-white/5 space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Privacy & Telemetry Controls</h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
              <div>
                <div className="font-semibold text-slate-200">Save Dictation History Locally</div>
                <div className="text-slate-400 text-[11px]">Stores transcripts in your local encrypted database.</div>
              </div>
              <input
                type="checkbox"
                checked={settings.retainHistory}
                onChange={(e) => updateSettings({ retainHistory: e.target.checked })}
                className="w-4 h-4 rounded accent-brand"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
              <div>
                <div className="font-semibold text-slate-200">Context Awareness</div>
                <div className="text-slate-400 text-[11px]">Detects active app to auto-switch writing mode (e.g. VS Code &rarr; Developer).</div>
              </div>
              <input
                type="checkbox"
                checked={settings.enableContextAwareness}
                onChange={(e) => updateSettings({ enableContextAwareness: e.target.checked })}
                className="w-4 h-4 rounded accent-brand"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-charcoal-800 border border-white/5">
              <div>
                <div className="font-semibold text-slate-200">Opt-in Product Analytics</div>
                <div className="text-slate-400 text-[11px]">Sends anonymous event counts (never audio or transcript text).</div>
              </div>
              <input
                type="checkbox"
                checked={settings.analyticsEnabled}
                onChange={(e) => updateSettings({ analyticsEnabled: e.target.checked })}
                className="w-4 h-4 rounded accent-brand"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
