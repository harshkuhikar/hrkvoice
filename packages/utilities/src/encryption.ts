/**
 * Local Data Encryption Service for HRKVoice
 * Encrypts API keys and sensitive settings stored on disk
 */

import crypto from 'crypto';
import os from 'os';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

export class LocalEncryptionService {
  private masterSecret: string;

  constructor(customSecret?: string) {
    // Generate machine-stable fingerprint if custom secret not provided
    this.masterSecret = customSecret || `${os.hostname()}-${os.platform()}-${os.userInfo().username}-hrkvoice-vault`;
  }

  /**
   * Encrypts plaintext string using AES-256-GCM
   */
  public encrypt(plainText: string): string {
    if (!plainText) return '';
    try {
      const salt = crypto.randomBytes(SALT_LENGTH);
      const iv = crypto.randomBytes(IV_LENGTH);

      const key = crypto.pbkdf2Sync(
        this.masterSecret,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        'sha256'
      );

      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      let encrypted = cipher.update(plainText, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      // Format: salt:iv:tag:ciphertext
      return `${salt.toString('hex')}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
    } catch (err: any) {
      console.error('[LocalEncryptionService] Encryption error:', err.message);
      return plainText; // Fail-safe fallback
    }
  }

  /**
   * Decrypts AES-256-GCM encrypted string
   */
  public decrypt(cipherPayload: string): string {
    if (!cipherPayload) return '';
    const parts = cipherPayload.split(':');
    if (parts.length !== 4) {
      // Not encrypted format (e.g., legacy or plain)
      return cipherPayload;
    }

    try {
      const [saltHex, ivHex, tagHex, encryptedHex] = parts;
      const salt = Buffer.from(saltHex, 'hex');
      const iv = Buffer.from(ivHex, 'hex');
      const tag = Buffer.from(tagHex, 'hex');

      const key = crypto.pbkdf2Sync(
        this.masterSecret,
        salt,
        ITERATIONS,
        KEY_LENGTH,
        'sha256'
      );

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (err: any) {
      console.warn('[LocalEncryptionService] Decryption failed, returning empty:', err.message);
      return '';
    }
  }

  /**
   * Mask an API key for safe display (e.g. "sk-...a4b1")
   */
  public static maskApiKey(key?: string): string {
    if (!key || key.length < 8) return '••••••••';
    const start = key.slice(0, 3);
    const end = key.slice(-4);
    return `${start}••••••••${end}`;
  }
}
