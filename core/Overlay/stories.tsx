import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Overlay, { LoadingOverlay } from '.'
import Card from '../Card'
import Text from '../Text'

export default {
  title: 'Layout/Overlay',
  component: Overlay
} as Meta

export const Default: StoryFn = () => (
  <Card style={{ position: 'relative' }}>
    <Text>Content behind the layer</Text>
    <Overlay blur={2} />
  </Card>
)

export const Loading: StoryFn = () => (
  <Card style={{ position: 'relative' }}>
    <Text>Content behind the layer</Text>
    <LoadingOverlay />
  </Card>
)
