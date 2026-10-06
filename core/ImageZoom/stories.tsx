import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import ImageZoom from '.'

export default {
  title: 'Data Display/ImageZoom',
  component: ImageZoom
} as Meta

const src = 'https://bolio-ui.com/logo-white.jpg'

export const Default: StoryFn = () => (
  <ImageZoom src={src} alt="Bolio UI logo" width="200px" height="120px" />
)

export const WithCaption: StoryFn = () => (
  <ImageZoom
    src={src}
    alt="Bolio UI logo"
    caption="The logo, on a white background"
    width="200px"
    height="120px"
  />
)
