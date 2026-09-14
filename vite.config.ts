import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves this repository below /CartoonPlus/, while local development serves from the root.
  // build:cloudflare overrides the production base with /.
  base: command === 'serve' ? '/' : '/CartoonPlus/',
  test: {
    environment: 'jsdom',
  },
}));
