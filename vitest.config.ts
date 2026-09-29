import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'packages/**/*.test.ts'],
    alias: {
      '@hrkvoice/shared': path.resolve(__dirname, './packages/shared/src'),
      '@hrkvoice/utilities': path.resolve(__dirname, './packages/utilities/src'),
      '@hrkvoice/speech': path.resolve(__dirname, './packages/speech/src'),
      '@hrkvoice/ai': path.resolve(__dirname, './packages/ai/src'),
      '@hrkvoice/dictionary': path.resolve(__dirname, './packages/dictionary/src'),
      '@hrkvoice/context': path.resolve(__dirname, './packages/context/src')
    }
  }
});
