/**
 * Windows Packaging Script for HRKVoice Desktop
 * Produces HRKVoice-Setup-1.0.0.exe using electron-builder
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const desktopDir = path.resolve(rootDir, 'apps/desktop');

console.log(`\n========================================`);
console.log(`📦 [PACKAGING] HRKVoice Windows Installer`);
console.log(`========================================\n`);

try {
  console.log(`1. Compiling Shared & Core Packages...`);
  execSync('npm run build:packages', { cwd: rootDir, stdio: 'inherit' });

  console.log(`\n2. Building Desktop React Renderer...`);
  execSync('npm run build:renderer', { cwd: desktopDir, stdio: 'inherit' });

  console.log(`\n3. Compiling Electron Main & Preload Process...`);
  execSync('npm run build:electron', { cwd: desktopDir, stdio: 'inherit' });

  console.log(`\n4. Running electron-builder for Windows (NSIS)...`);
  execSync('npx electron-builder --win --dir', { cwd: desktopDir, stdio: 'inherit' });

  console.log(`\n✅ [HRKVoice] Windows package generated successfully in release/ folder!\n`);
} catch (err) {
  console.error(`\n❌ [HRKVoice] Packaging encountered an error:`, err.message);
  process.exit(1);
}
