import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages serves the application from the domain root in both development and production.
  base: '/',
  test: {
    environment: 'jsdom',
  },
});
