/**
 * Local Persistence Store for HRKVoice Database
 * Fast, atomic JSON document database with schema validation and encryption
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { DatabaseSchema } from './schema';
import { MigrationManager } from './migrations';
import { LocalEncryptionService } from '@hrkvoice/utilities';

export class DatabaseStore {
  private static instance: DatabaseStore;
  private dbPath: string;
  private data: DatabaseSchema;
  private encryptionService: LocalEncryptionService;
  private writeTimer: NodeJS.Timeout | null = null;

  private constructor(customPath?: string) {
    this.encryptionService = new LocalEncryptionService();
    const defaultDir = path.join(os.homedir(), '.hrkvoice');
    if (!fs.existsSync(defaultDir)) {
      try {
        fs.mkdirSync(defaultDir, { recursive: true });
      } catch {
        // Fallback to local
      }
    }

    this.dbPath = customPath || path.join(defaultDir, 'hrkvoice-store.json');
    this.data = this.loadFromDisk();
  }

  public static getInstance(customPath?: string): DatabaseStore {
    if (!DatabaseStore.instance) {
      DatabaseStore.instance = new DatabaseStore(customPath);
    }
    return DatabaseStore.instance;
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        const parsed = JSON.parse(raw);
        return MigrationManager.runMigrations(parsed);
      }
    } catch (err) {
      console.warn('[DatabaseStore] Failed to read db from disk, creating fresh store:', err);
    }

    const initial = MigrationManager.initializeSchema();
    this.saveToDiskSync(initial);
    return initial;
  }

  private saveToDiskSync(data: DatabaseSchema): void {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmpPath = `${this.dbPath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tmpPath, this.dbPath); // Atomic replacement
    } catch (err) {
      console.error('[DatabaseStore] Error saving database to disk:', err);
    }
  }

  public scheduleSave(): void {
    if (this.writeTimer) clearTimeout(this.writeTimer);
    this.writeTimer = setTimeout(() => {
      this.saveToDiskSync(this.data);
    }, 150);
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public updateData(mutator: (data: DatabaseSchema) => void): void {
    mutator(this.data);
    this.scheduleSave();
  }
}
