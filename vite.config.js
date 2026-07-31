import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Custom domain (ella.top) is served from the site root.
export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_PATH ?? '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
