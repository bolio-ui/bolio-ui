import type { StorybookConfig } from '@storybook/react-vite'
import react from '@vitejs/plugin-react'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../core/**/stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  // styled-jsx only works through its babel plugin
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [react({ babel: { plugins: ['styled-jsx/babel'] } })]
    })
}

export default config
