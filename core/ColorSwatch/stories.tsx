import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import ColorSwatch from '.'

export default {
  title: 'Data Display/ColorSwatch',
  component: ColorSwatch
} as Meta

export const Default: StoryFn = () => (
  <>
    <ColorSwatch color="#3b82f6" />
    <ColorSwatch color="#f97316" square />
  </>
)
