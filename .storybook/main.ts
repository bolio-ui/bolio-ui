import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../core/**/stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public']
}

export default config
