import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import ScrollArea from '.'
import Text from '../Text'

export default {
  title: 'Layout/ScrollArea',
  component: ScrollArea
} as Meta

const lines = [...Array(20)].map((_, i) => (
  <Text key={i} my={0.5}>
    Line {i + 1}
  </Text>
))

export const Default: StoryFn = () => (
  <ScrollArea height="200px" aria-label="Lines">
    {lines}
  </ScrollArea>
)

export const Horizontal: StoryFn = () => (
  <ScrollArea orientation="horizontal" aria-label="Wide content">
    <div style={{ width: 1200 }}>A line wider than its container.</div>
  </ScrollArea>
)

export const Hover: StoryFn = () => (
  <ScrollArea height="200px" scrollbar="hover" aria-label="Lines">
    {lines}
  </ScrollArea>
)
