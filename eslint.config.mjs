import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import typescript from '@typescript-eslint/eslint-plugin'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  {
    ignores: [
      '.now/**',
      '.next/**',
      'examples/**',
      'dist/**',
      'esm/**',
      'public/**',
      'scripts/**',
      'tests/**',
      '**/*.config.js',
      'compat/**'
    ]
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  ...typescript.configs['flat/recommended'],
  prettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    settings: {
      react: { version: 'detect' }
    },
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      // jsx and global are styled-jsx; unselectable is an old IE attribute
      // that Select still renders
      'react/no-unknown-property': [
        'error',
        { ignore: ['jsx', 'global', 'unselectable'] }
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  },
  {
    // core was not linted before. These rules still fail there and are
    // turned on one at a time, each in the pull request that fixes it.
    // Remove this block, and the disable directives it hides, when empty.
    files: ['core/**'],
    linterOptions: { reportUnusedDisableDirectives: false },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off'
    }
  }
]
