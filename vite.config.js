import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Relative base so it deploys seamlessly to GitHub Pages, Cloudflare, or custom domain
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    open: false
  }
});
