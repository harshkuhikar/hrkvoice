/**
 * User Profile & Settings Management Modal for HRKVoice
 * Allows signed-in users to manage personal details, default languages,
 * writing modes, AI toggles, custom dictionary words, and usage analytics.
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Settings,
  Sliders,
  BookOpen,
  BarChart3,
  X,
  Check,
  Crown,
  Sparkles,
  Globe,
  Trash2,
  Plus,
  ShieldCheck,
  Zap,
  Clock,
  FileText,
  Volume2
} from 'lucide-react';
import { useAuth, AuthUser, UserPreferences } from '../hooks/useAuth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_LANGUAGES = [
  { code: 'gu', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'en', name: 'English / Hinglish (India)', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu (اردو)', flag: '🇮🇳' },
  { code: 'sa', name: 'Sanskrit (संस्कृतम्)', flag: '🇮🇳' },
  { code: 'or', name: 'Odia (ଓଡ଼ିଆ)', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese (অসমীয়া)', flag: '🇮🇳' }
];

const WRITING_MODES = [
  { id: 'general', name: 'General', desc: 'Natural speech, proper punctuation & paragraphs' },
  { id: 'email', name: 'Email Mode', desc: 'Salutation, structured paragraphs, sign-off' },
  { id: 'developer', name: 'Developer Mode', desc: 'camelCase, CLI commands, code variables' },
  { id: 'chat', name: 'WhatsApp / Chat', desc: 'Crisp, conversational, fast messaging' },
  { id: 'notes', name: 'Meeting Notes', desc: 'Markdown bullet points & summaries' },
  { id: 'prompt', name: 'AI Prompt', desc: 'Structured prompts for LLMs' }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, updatePreferences, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'voice' | 'dictionary' | 'stats'>('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [defaultLang, setDefaultLang] = useState('gu');
  const [defaultMode, setDefaultMode] = useState('general');
  const [autoPunctuation, setAutoPunctuation] = useState(true);
  const [fillerRemoval, setFillerRemoval] = useState(true);
  const [autoCopy, setAutoCopy] = useState(false);
  const [newVocabWord, setNewVocabWord] = useState('');
  const [vocabList, setVocabList] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state with currentUser
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      const prefs = currentUser.preferences;
      if (prefs) {
        setDefaultLang(prefs.defaultLanguage || 'gu');
        setDefaultMode(prefs.defaultMode || 'general');
        setAutoPunctuation(prefs.autoPunctuation !== false);
        setFillerRemoval(prefs.fillerRemoval !== false);
        setAutoCopy(Boolean(prefs.autoCopy));
        setVocabList(prefs.customVocabulary || []);
      }
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    const word = newVocabWord.trim();
    if (word && !vocabList.includes(word)) {
      const updated = [...vocabList, word];
      setVocabList(updated);
      setNewVocabWord('');
    }
  };

  const handleRemoveVocab = (wordToRemove: string) => {
    setVocabList(vocabList.filter(w => w !== wordToRemove));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile({
        name: name.trim(),
        preferences: {
          defaultLanguage: defaultLang,
          defaultMode,
          autoPunctuation,
          fillerRemoval,
          autoCopy,
          customVocabulary: vocabList
        }
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);
    } catch (e) {
      console.warn('Error saving profile:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-charcoal-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-brand/20 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center font-extrabold text-lg shadow-lg shadow-brand/20">
              {name.slice(0, 2).toUpperCase() || 'HR'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white tracking-tight">{name || 'Creator'}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold uppercase">
                  <Crown className="w-3 h-3 text-amber-400" />
                  {currentUser.plan} Plan
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto relative z-10">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'profile'
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'voice'
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Voice & Language</span>
          </button>

          <button
            onClick={() => setActiveTab('dictionary')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'dictionary'
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Custom Vocabulary ({vocabList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'stats'
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Productivity Stats</span>
          </button>
        </div>

        {/* Tab 1: Account Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Your Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address:</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-charcoal-800/50 border border-white/5 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 focus:outline-none cursor-not-allowed font-mono"
                />
              </div>
            </div>

            {/* Subscription Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand/15 via-indigo-600/10 to-transparent border border-brand/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-bold text-white">Active Plan: PRO UNLIMITED</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Lifetime Valid
                </span>
              </div>
              <p className="text-xs text-slate-300">
                You have unrestricted access to all 23 Indian languages, neural Whisper Large-v3 cloud speech, desktop global hotkeys, and AI speech repair.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                <span>Account Created: {new Date(currentUser.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>365-Day Session Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Voice & Language Preferences */}
        {activeTab === 'voice' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-brand-light" />
                  Default Spoken Language:
                </label>
                <select
                  value={defaultLang}
                  onChange={(e) => setDefaultLang(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
                >
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-brand-light" />
                  Default Writing Mode:
                </label>
                <select
                  value={defaultMode}
                  onChange={(e) => setDefaultMode(e.target.value)}
                  className="w-full bg-charcoal-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
                >
                  {WRITING_MODES.map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.name} — {mode.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* AI Enhancement Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-white/5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Speech Repair & Formatting</h4>

              <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-800/60 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-slate-200">Automatic Punctuation & Indian Currency</div>
                  <div className="text-[11px] text-slate-400">Inserts commas, periods, and formats "50 thousand rupees" into "₹50,000".</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoPunctuation}
                  onChange={(e) => setAutoPunctuation(e.target.checked)}
                  className="w-4 h-4 accent-brand cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-800/60 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-slate-200">Verbal Filler Stripping</div>
                  <div className="text-[11px] text-slate-400">Automatically eliminates "um", "uh", "matlab", and "etle ke" from speech.</div>
                </div>
                <input
                  type="checkbox"
                  checked={fillerRemoval}
                  onChange={(e) => setFillerRemoval(e.target.checked)}
                  className="w-4 h-4 accent-brand cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-800/60 border border-white/5">
                <div>
                  <div className="text-xs font-bold text-slate-200">Auto-Copy to Clipboard</div>
                  <div className="text-[11px] text-slate-400">Copies your transcribed speech to clipboard immediately after finishing dictation.</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoCopy}
                  onChange={(e) => setAutoCopy(e.target.checked)}
                  className="w-4 h-4 accent-brand cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Vocabulary */}
        {activeTab === 'dictionary' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <p className="text-xs text-slate-300 leading-relaxed">
              Add your client names, brand names, or specialized regional words. The AI speech pipeline will prioritize them and ensure they are always spelled accurately.
            </p>

            <form onSubmit={handleAddVocab} className="flex gap-2">
              <input
                type="text"
                value={newVocabWord}
                onChange={(e) => setNewVocabWord(e.target.value)}
                placeholder="e.g. HRKVoice, Rohit Shah, Ahmedabad, GST Invoice..."
                className="flex-1 bg-charcoal-800 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand"
              />
              <button
                type="submit"
                disabled={!newVocabWord.trim()}
                className="px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand/20 transition-all disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Word</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-400">Custom Terms ({vocabList.length}):</span>
              {vocabList.length === 0 ? (
                <div className="p-6 rounded-2xl bg-charcoal-800/30 border border-white/5 text-center text-xs text-slate-500">
                  No custom vocabulary added yet. Type a term above and click Add Word!
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {vocabList.map((word) => (
                    <span
                      key={word}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand/15 text-brand-light border border-brand/30 text-xs font-medium"
                    >
                      <span>{word}</span>
                      <button
                        onClick={() => handleRemoveVocab(word)}
                        className="hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Productivity Statistics */}
        {activeTab === 'stats' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-charcoal-800/60 border border-white/5 text-center space-y-1">
                <div className="text-2xl font-extrabold text-brand-light font-mono">
                  {currentUser.wordsDictated.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Words Dictated</div>
              </div>

              <div className="p-4 rounded-2xl bg-charcoal-800/60 border border-white/5 text-center space-y-1">
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {currentUser.minutesSaved}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Minutes Saved</div>
              </div>

              <div className="p-4 rounded-2xl bg-charcoal-800/60 border border-white/5 text-center space-y-1">
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  {currentUser.sessionsCount}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Voice Sessions</div>
              </div>

              <div className="p-4 rounded-2xl bg-charcoal-800/60 border border-white/5 text-center space-y-1">
                <div className="text-2xl font-extrabold text-indigo-400 font-mono">99.4%</div>
                <div className="text-[11px] text-slate-400 font-medium">Speech Accuracy</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal-800/40 border border-white/5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-bold text-white">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Dictation Velocity Comparison:</span>
              </div>
              <p>
                Speaking in Gujarati / Hindi at <strong>140 WPM</strong> saves approximately <strong>3.5 hours every week</strong> compared to traditional keyboard typing (35 WPM).
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <button
            onClick={logout}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors"
          >
            Sign Out of Account
          </button>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Preferences Saved!</span>
              </span>
            )}

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-lg shadow-brand/25 transition-all disabled:opacity-40"
            >
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
