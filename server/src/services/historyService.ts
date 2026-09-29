/**
 * History & Usage Analytics Service for HRKVoice Server
 */

import { TranscriptionHistoryItem, UsageStatistics } from '@hrkvoice/shared';
import { DatabaseStore } from '../database/db';

export class HistoryService {
  private db: DatabaseStore;

  constructor() {
    this.db = DatabaseStore.getInstance();
  }

  public getHistory(): TranscriptionHistoryItem[] {
    return [...this.db.getData().history];
  }

  public addHistoryItem(item: Omit<TranscriptionHistoryItem, 'id' | 'timestamp'>): TranscriptionHistoryItem | null {
    const settings = this.db.getData().settings;

    // Respect privacy setting: do not store transcripts if retainHistory is disabled
    if (!settings.retainHistory) {
      this.updateUsageOnly(item.durationMs, item.wordsCount, item.sourceLanguage, item.mode);
      return null;
    }

    const id = `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newEntry: TranscriptionHistoryItem = {
      ...item,
      id,
      timestamp: new Date().toISOString(),
      audioRetained: settings.retainAudio
    };

    this.db.updateData(data => {
      data.history.unshift(newEntry);
      // Keep up to 500 recent items
      if (data.history.length > 500) {
        data.history = data.history.slice(0, 500);
      }

      // Update usage stats
      this.mutateUsageStats(data.usage, item.durationMs, item.wordsCount, item.sourceLanguage, item.mode);
    });

    return newEntry;
  }

  private updateUsageOnly(durationMs: number, wordsCount: number, lang: string, mode: string): void {
    this.db.updateData(data => {
      this.mutateUsageStats(data.usage, durationMs, wordsCount, lang, mode);
    });
  }

  private mutateUsageStats(
    usage: UsageStatistics,
    durationMs: number,
    wordsCount: number,
    lang: string,
    mode: string
  ): void {
    const minutes = durationMs / 60000;
    usage.totalMinutesDictated = Math.round((usage.totalMinutesDictated + minutes) * 10) / 10;
    usage.totalWordsDictated += wordsCount;
    usage.totalSessions += 1;
    // Estimated time saved calculation: standard typing speed ~40 wpm vs dictation ~150 wpm
    const typingMinutesNeeded = wordsCount / 40;
    const voiceMinutesSpent = Math.max(0.1, minutes);
    usage.estimatedMinutesSaved = Math.max(0, Math.round((usage.estimatedMinutesSaved + (typingMinutesNeeded - voiceMinutesSpent)) * 10) / 10);

    usage.languageDistribution[lang] = (usage.languageDistribution[lang] || 0) + 1;
    usage.modeDistribution[mode] = (usage.modeDistribution[mode] || 0) + 1;
  }

  public getUsage(): UsageStatistics {
    return { ...this.db.getData().usage };
  }

  public deleteItem(id: string): boolean {
    let deleted = false;
    this.db.updateData(data => {
      const len = data.history.length;
      data.history = data.history.filter(h => h.id !== id);
      deleted = data.history.length < len;
    });
    return deleted;
  }

  public clearAllHistory(): void {
    this.db.updateData(data => {
      data.history = [];
    });
  }

  public exportHistory(format: 'json' | 'csv' | 'txt'): string {
    const history = this.getHistory();
    if (format === 'json') {
      return JSON.stringify(history, null, 2);
    }
    if (format === 'csv') {
      const header = 'id,timestamp,durationMs,sourceLanguage,mode,wordsCount,processedText\n';
      const rows = history.map(h =>
        `"${h.id}","${h.timestamp}","${h.durationMs}","${h.sourceLanguage}","${h.mode}","${h.wordsCount}","${h.processedText.replace(/"/g, '""')}"`
      ).join('\n');
      return header + rows;
    }
    // txt
    return history.map(h => `[${h.timestamp}] [${h.sourceLanguage}] [${h.mode}]\n${h.processedText}\n`).join('\n---\n\n');
  }
}
