import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.join(__dirname, 'client'),
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      '/api': { target: 'http://127.0.0.1:4000', changeOrigin: true }
    }
  },
  build: {
    outDir: path.join(__dirname, 'client', 'dist'),
    emptyOutDir: true
  },
  preview: { host: '0.0.0.0', port: 5173, allowedHosts: true }
});
