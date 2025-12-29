import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/components/payment'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/api': path.resolve(__dirname, './src/api')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://sambackend-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🔴 Proxy error:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📤 Sending Request:', req.method, req.url);
            // Add CORS headers to the proxy request
            proxyReq.setHeader('Origin', 'https://jansanfrontend-production-1945.up.railway.app');
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Response Status:', proxyRes.statusCode, req.url);
            // Add CORS headers to the response if they're missing
            if (!proxyRes.headers['access-control-allow-origin']) {
              proxyRes.headers['access-control-allow-origin'] = 'https://jansanfrontend-production-1945.up.railway.app';
            }
            if (!proxyRes.headers['access-control-allow-credentials']) {
              proxyRes.headers['access-control-allow-credentials'] = 'true';
            }
          });
        },
      }
    }
  }
})
