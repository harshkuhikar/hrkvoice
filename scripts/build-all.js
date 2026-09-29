/**
 * Master Build Script for HRKVoice Platform
 * Sequentially builds packages, server, desktop renderer, electron main, and web dashboard
 */

const { execSync } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function run(cmd, desc) {
  console.log(`\n========================================`);
  console.log(`🔨 [BUILD] ${desc}`);
  console.log(`Command: ${cmd}`);
  console.log(`========================================\n`);
  execSync(cmd, { cwd: rootDir, stdio: 'inherit' });
}

try {
  run('npm run build:packages', 'Compiling Core TypeScript Packages');
  run('npm run build:server', 'Building Local Express Server');
  run('npm run build:renderer --workspace=apps/desktop', 'Compiling Desktop Vite Renderer');
  run('npm run build:electron --workspace=apps/desktop', 'Compiling Electron Main & Preload');
  run('npm run build:web', 'Building Web Dashboard & Landing Page');
  console.log(`\n🎉 [HRKVoice] Full project build completed successfully!\n`);
} catch (err) {
  console.error(`\n❌ [HRKVoice] Build failed:`, err.message);
  process.exit(1);
}
