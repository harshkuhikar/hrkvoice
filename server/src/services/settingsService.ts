/**
 * Settings Service for HRKVoice Server
 */

import { AppSettings } from '@hrkvoice/shared';
import { DatabaseStore } from '../database/db';
import { LocalEncryptionService } from '@hrkvoice/utilities';

export class SettingsService {
  private db: DatabaseStore;

  constructor() {
    this.db = DatabaseStore.getInstance();
  }

  public getSettings(): AppSettings {
    const data = this.db.getData();
    const settings = { ...data.settings };

    // Merge from process.env if present
    const groqKey = process.env.GROQ_API_KEY || process.env.GROQ_SPEECH_API_KEY || settings.apiKeys.groq || '';
    const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_SPEECH_API_KEY || settings.apiKeys.openai || '';
    const geminiKey = process.env.GEMINI_API_KEY || settings.apiKeys.gemini || '';

    settings.apiKeys = {
      ...settings.apiKeys,
      groq: groqKey,
      openai: openaiKey,
      gemini: geminiKey
    };

    if (groqKey && (settings.speechProvider === 'mock' || !settings.speechProvider)) {
      settings.speechProvider = 'groq';
    }
    if (groqKey && (settings.aiProvider === 'mock' || !settings.aiProvider)) {
      settings.aiProvider = 'groq';
    } else if (geminiKey && (settings.aiProvider === 'mock' || !settings.aiProvider)) {
      settings.aiProvider = 'gemini';
    }

    return settings;
  }

  public updateSettings(partial: Partial<AppSettings>): AppSettings {
    let updated: AppSettings = this.getSettings();
    this.db.updateData(data => {
      data.settings = {
        ...data.settings,
        ...partial,
        apiKeys: {
          ...data.settings.apiKeys,
          ...(partial.apiKeys || {})
        }
      };
      updated = { ...data.settings };
    });
    return updated;
  }
}
