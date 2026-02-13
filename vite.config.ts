import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    server: {
      port: 3000,
      host: true,
      allowedHosts: true,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'icons/*.png', 'icons/*.svg'],
        manifest: false, // Use existing manifest.json
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false, // Disable in dev for faster builds
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
        '@components': path.resolve('./components'),
        '@config': path.resolve('./config'),
        '@store': path.resolve('./store'),
        '@utils': path.resolve('./utils'),
        '@hooks': path.resolve('./hooks'),
        '@types': path.resolve('./types'),
      },
    },
    build: {
      // Enable source maps for debugging in production
      sourcemap: !isProd,
      // Optimize chunk size
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunk for React
            'vendor-react': ['react', 'react-dom'],
            // Lucide icons - they're commonly used
            'vendor-icons': ['lucide-react'],
          },
        },
      },
      // Minification settings
      minify: isProd ? 'esbuild' : false,
      target: 'es2020',
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react'],
    },
    // Enable CSS code splitting
    css: {
      devSourcemap: true,
    },
  };
});
