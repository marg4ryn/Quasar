import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    // General rules
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
    },
    extends: [js.configs.recommended, prettier],
  },

  // TypeScript rules
  tseslint.configs.recommended,

  // Vue rules
  pluginVue.configs['flat/essential'],

  {
    // Vue TypeScript
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
])
