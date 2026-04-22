import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/kudago-api': {
        target: 'https://kudago.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kudago-api/, '/public-api/v1.4')
      }
    }
  }
});
