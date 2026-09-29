/**
 * Security Policies and Hardening for HRKVoice Desktop
 */

import { session } from 'electron';

export function configureSecurityPolicies(): void {
  // Set Content-Security-Policy header
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https:; media-src 'self' blob: mediastream:; connect-src 'self' http://localhost:* ws://localhost:* https://api.openai.com https://api.groq.com https://api.deepgram.com https://speech.googleapis.com https://generativelanguage.googleapis.com https://api.anthropic.com;"
        ]
      }
    });
  });

  // Block creation of untrusted new windows
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    const allowedPermissions = ['media', 'clipboard-read', 'clipboard-write'];
    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      callback(false);
    }
  });
}
