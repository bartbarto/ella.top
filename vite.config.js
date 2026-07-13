import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Use repo name as base path on GitHub Pages; override with VITE_BASE_PATH if needed.
const base = process.env.VITE_BASE_PATH ?? (process.env.GITHUB_ACTIONS ? '/ella.top/' : '/');

export default defineConfig({
  plugins: [vue()],
  base,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
