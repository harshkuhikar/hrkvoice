/**
 * Database Migrations for HRKVoice
 */

import { DatabaseSchema } from './schema';
import { DEFAULT_APP_SETTINGS, INITIAL_DICTIONARY_ENTRIES, INITIAL_SNIPPETS } from '@hrkvoice/shared';

export class MigrationManager {
  public static CURRENT_VERSION = 1;

  public static initializeSchema(): DatabaseSchema {
    return {
      version: this.CURRENT_VERSION,
      settings: { ...DEFAULT_APP_SETTINGS },
      dictionary: [...INITIAL_DICTIONARY_ENTRIES],
      snippets: [...INITIAL_SNIPPETS],
      history: [],
      usage: {
        totalMinutesDictated: 0,
        totalWordsDictated: 0,
        totalSessions: 0,
        estimatedMinutesSaved: 0,
        languageDistribution: {},
        modeDistribution: {}
      }
    };
  }

  public static runMigrations(data: any): DatabaseSchema {
    let schema: DatabaseSchema = data;

    if (!schema.version || schema.version < 1) {
      schema.version = 1;
      schema.settings = { ...DEFAULT_APP_SETTINGS, ...schema.settings };
      schema.dictionary = schema.dictionary || [...INITIAL_DICTIONARY_ENTRIES];
      schema.snippets = schema.snippets || [...INITIAL_SNIPPETS];
      schema.history = schema.history || [];
      schema.usage = schema.usage || {
        totalMinutesDictated: 0,
        totalWordsDictated: 0,
        totalSessions: 0,
        estimatedMinutesSaved: 0,
        languageDistribution: {},
        modeDistribution: {}
      };
    }

    return schema;
  }
}
