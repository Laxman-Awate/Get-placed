import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow tunnel hosts (cloudflare etc.) without hardcoding one URL.
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep the heavy editor out of the initial bundle.
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-monaco': ['@monaco-editor/react', 'monaco-editor'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router'],
  },
});
