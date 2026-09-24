import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import typescript from '@typescript-eslint/eslint-plugin'
import prettierConfig from 'eslint-config-prettier/flat'
import prettier from 'eslint-plugin-prettier'

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
  prettierConfig,
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
      'react-hooks': reactHooks,
      prettier
    },
    rules: {
      // what plugin:prettier/recommended turned on
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off'
    }
  }
]
