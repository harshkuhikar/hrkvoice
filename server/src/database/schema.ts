/**
 * Database Schema and Entity Definitions for HRKVoice Server
 */

import { AppSettings, DictionaryEntry, Snippet, TranscriptionHistoryItem, UsageStatistics } from '@hrkvoice/shared';

export interface DatabaseSchema {
  version: number;
  settings: AppSettings;
  dictionary: DictionaryEntry[];
  snippets: Snippet[];
  history: TranscriptionHistoryItem[];
  usage: UsageStatistics;
}
