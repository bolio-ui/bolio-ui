import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import JsonViewer from '.'

export default {
  title: 'Data Display/JsonViewer',
  component: JsonViewer
} as Meta

const value = {
  name: 'Ada',
  age: 36,
  admin: true,
  tags: ['math', 'code'],
  address: { city: 'London', geo: { lat: 51.5, lng: -0.12 } }
}

export const Default: StoryFn = () => <JsonViewer value={value} />

export const Controls: StoryFn = () => (
  <JsonViewer value={value} withControls withCopyButton />
)

export const Expanded: StoryFn = () => <JsonViewer value={value} allExpanded />
