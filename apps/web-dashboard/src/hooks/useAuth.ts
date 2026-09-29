/**
 * Authentication and Persistent User Session Hook for HRKVoice WebApp
 * Supports 365-day persistent login, profile storage, and usage tracking
 */

import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  defaultLanguage: string;
  defaultMode: string;
  autoPunctuation: boolean;
  fillerRemoval: boolean;
  autoCopy: boolean;
  customVocabulary: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'lifetime';
  wordsDictated: number;
  minutesSaved: number;
  sessionsCount: number;
  createdAt: string;
  lastLoginAt: string;
  preferences?: UserPreferences;
}

interface StoredSession {
  user: AuthUser;
  token: string;
  expiresAt: number; // Timestamp (default: 365 days from login)
}

const SESSION_KEY = 'hrkvoice_auth_session';
const USERS_DB_KEY = 'hrkvoice_users_db';
const SESSION_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 365 Days Persistent Login

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing persistent session on boot
  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) {
        const session: StoredSession = JSON.parse(rawSession);
        // Verify expiration (365 days)
        if (session.expiresAt && Date.now() < session.expiresAt) {
          setCurrentUser(session.user);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.warn('[useAuth] Error reading session from localStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Helper to save session for 365 days
  const persistSession = useCallback((user: AuthUser) => {
    const session: StoredSession = {
      user,
      token: `hrkv_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: Date.now() + SESSION_DURATION_MS
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setCurrentUser(user);
  }, []);

  // Sign in existing user
  const login = useCallback(
    async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
      if (!email.trim() || !password.trim()) {
        return { success: false, error: 'Email and password are required.' };
      }

      const rawDb = localStorage.getItem(USERS_DB_KEY) || '[]';
      const users: Array<AuthUser & { passwordHash: string }> = JSON.parse(rawDb);
      const normalizedEmail = email.trim().toLowerCase();

      const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!existing) {
        // If demo user or new login, auto-register for frictionless onboarding
        const newUser: AuthUser & { passwordHash: string } = {
          id: `usr_${Date.now()}`,
          name: email.split('@')[0],
          email: normalizedEmail,
          plan: 'pro', // Give full Pro features to registered users
          wordsDictated: 140,
          minutesSaved: 12,
          sessionsCount: 3,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          passwordHash: password
        };
        users.push(newUser);
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
        persistSession(newUser);
        return { success: true };
      }

      if (existing.passwordHash !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      existing.lastLoginAt = new Date().toISOString();
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      persistSession(existing);
      return { success: true };
    },
    [persistSession]
  );

  // Register brand new user
  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (!name.trim() || !email.trim() || !password.trim()) {
        return { success: false, error: 'All fields are required.' };
      }

      const rawDb = localStorage.getItem(USERS_DB_KEY) || '[]';
      const users: Array<AuthUser & { passwordHash: string }> = JSON.parse(rawDb);
      const normalizedEmail = email.trim().toLowerCase();

      if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        return { success: false, error: 'An account with this email already exists. Please Sign In.' };
      }

      const newUser: AuthUser & { passwordHash: string } = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        plan: 'pro',
        wordsDictated: 0,
        minutesSaved: 0,
        sessionsCount: 1,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        passwordHash: password
      };

      users.push(newUser);
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      persistSession(newUser);
      return { success: true };
    },
    [persistSession]
  );

  // Log out user
  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  }, []);

  // Update user stats after a speech dictation
  const trackDictation = useCallback((words: number) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      const updated: AuthUser = {
        ...prev,
        wordsDictated: prev.wordsDictated + words,
        minutesSaved: Math.round(prev.minutesSaved + (words / 150) * 3),
        sessionsCount: prev.sessionsCount + 1
      };
      // Save to localStorage
      persistSession(updated);
      return updated;
    });
  }, [persistSession]);

  // Update user profile information (Name, Email, etc.)
  const updateProfile = useCallback(
    async (updated: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> => {
      if (!currentUser) return { success: false, error: 'User is not logged in.' };

      const rawDb = localStorage.getItem(USERS_DB_KEY) || '[]';
      const users: Array<AuthUser & { passwordHash?: string }> = JSON.parse(rawDb);
      const idx = users.findIndex(u => u.id === currentUser.id);

      const mergedUser: AuthUser = {
        ...currentUser,
        ...updated
      };

      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          ...updated
        };
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
      }

      persistSession(mergedUser);
      return { success: true };
    },
    [currentUser, persistSession]
  );

  // Update voice and app preferences
  const updatePreferences = useCallback(
    async (prefs: Partial<UserPreferences>): Promise<{ success: boolean }> => {
      if (!currentUser) return { success: false };

      const currentPrefs: UserPreferences = currentUser.preferences || {
        defaultLanguage: 'gu',
        defaultMode: 'general',
        autoPunctuation: true,
        fillerRemoval: true,
        autoCopy: false,
        customVocabulary: []
      };

      const mergedPrefs: UserPreferences = {
        ...currentPrefs,
        ...prefs
      };

      return await updateProfile({ preferences: mergedPrefs });
    },
    [currentUser, updateProfile]
  );

  return {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    login,
    register,
    logout,
    trackDictation,
    updateProfile,
    updatePreferences
  };
}
