import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Mark from '.'

export default {
  title: 'Typography/Mark',
  component: Mark
} as Meta

export const Default: StoryFn = () => (
  <Mark highlight="theme">
    Every component follows the theme of the provider.
  </Mark>
)

export const Terms: StoryFn = () => (
  <Mark highlight={['button', 'input']}>
    Button and Input share the same scale. Each Button reads it.
  </Mark>
)
