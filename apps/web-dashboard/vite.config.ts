import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@hrkvoice/shared': path.resolve(__dirname, './src/shared'),
      '@hrkvoice/ai': path.resolve(__dirname, './src/ai')
    }
  },
  server: {
    port: 3000
  }
});
