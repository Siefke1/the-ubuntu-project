import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Use automatic JSX runtime for React 19
      jsxRuntime: 'automatic',
    }),
  ],
  base: '/the-ubuntu-project/', // GitHub Pages base path
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Disable chunking to prevent circular dependency issues
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunking
      },
    },
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 2000, // Increase limit to allow larger chunks
  },
  optimizeDeps: {
    // Include all major dependencies for pre-bundling
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      'lodash',
    ],
  },
})