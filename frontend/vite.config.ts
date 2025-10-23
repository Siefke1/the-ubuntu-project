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
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      'lodash',
    ],
    exclude: [],
    force: true, // Force re-optimization
  },
  esbuild: {
    // Ensure React 19 compatibility
    jsx: 'automatic',
    jsxImportSource: 'react',
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
      external: () => {
        // Don't externalize anything, but ensure React is bundled correctly
        return false;
      },
      output: {
        manualChunks: (id) => {
          // Simplified chunking strategy
          if (id.includes('node_modules')) {
            // All React-related dependencies in one chunk
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            // Material-UI in its own chunk
            if (id.includes('@mui/') || id.includes('@emotion/')) {
              return 'mui-vendor';
            }
            // Other major libraries
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('lodash')) return 'lodash';
            if (id.includes('@radix-ui')) return 'radix-vendor';
            if (id.includes('lucide-react')) return 'lucide-vendor';
            if (id.includes('@uiw/')) return 'md-editor-vendor';
            
            // Everything else in vendor
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
    chunkSizeWarningLimit: 1000, // Increase limit temporarily
    target: 'esnext',
    minify: 'esbuild',
    // Add sourcemap for debugging
    sourcemap: false,
  },
})