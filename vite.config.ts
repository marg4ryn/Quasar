// Vite bundler configuration
/// <reference types="vitest" />

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Development server
  server: {
    host: true,
  },

  // Vite plugins
  plugins: [vue()],

  // Vitest testing
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts', 'src/**/*.spec.ts'],
    exclude: ['e2e/*'],
    typecheck: {
      tsconfig: './tsconfig.vitest.json',
    },
  },

  // Path aliases
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // Global SCSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables.scss" as *;
          @use "@/styles/mixins.scss" as *;
        `,
      },
    },
  },
})
