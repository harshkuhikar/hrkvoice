import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src/renderer'),
  base: './',
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/renderer/index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@hrkvoice/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@hrkvoice/utilities': path.resolve(__dirname, '../../packages/utilities/src'),
      '@hrkvoice/speech': path.resolve(__dirname, '../../packages/speech/src'),
      '@hrkvoice/ai': path.resolve(__dirname, '../../packages/ai/src'),
      '@hrkvoice/dictionary': path.resolve(__dirname, '../../packages/dictionary/src'),
      '@hrkvoice/context': path.resolve(__dirname, '../../packages/context/src')
    }
  },
  server: {
    port: 5173,
    strictPort: true
  }
});
