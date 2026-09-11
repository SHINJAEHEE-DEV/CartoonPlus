import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repository below /CartoonPlus/, rather than the domain root.
  // build:cloudflare overrides this with / while both deployments coexist.
  base: '/CartoonPlus/',
  test: {
    environment: 'jsdom',
  },
});
