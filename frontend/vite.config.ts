import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add React plugin options to prevent hydration issues
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    // Add bundle analyzer in development
    process.env.NODE_ENV === 'development' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  base: '/the-ubuntu-project/', // GitHub Pages base path
  define: {
    // Ensure React 19 compatibility
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Ensure single React instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // React core - keep React together to avoid multiple instances
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Material-UI
            if (id.includes('@mui/material') || id.includes('@mui/icons-material') || id.includes('@mui/system')) {
              return 'mui-vendor';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            // Lodash
            if (id.includes('lodash')) {
              return 'lodash';
            }
            // Other large vendor libraries
            if (id.includes('@emotion') || id.includes('@mui/styled-engine')) {
              return 'emotion';
            }
            // Other vendor libraries
            return 'vendor';
          }
          
          // App code chunking
          if (id.includes('/src/')) {
            // Auth related
            if (id.includes('Auth') || id.includes('auth')) {
              return 'auth';
            }
            // Components
            if (id.includes('/components/')) {
              return 'components';
            }
            // Hooks
            if (id.includes('/hooks/')) {
              return 'hooks';
            }
            // Context
            if (id.includes('/context/')) {
              return 'context';
            }
            // Utils
            if (id.includes('/utils/') || id.includes('/texts/')) {
              return 'utils';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    target: 'esnext',
    minify: 'esbuild',
    // Add sourcemap for debugging
    sourcemap: false,
  },
})
