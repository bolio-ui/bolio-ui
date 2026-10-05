import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import SegmentedControl from '.'

export default {
  title: 'Navigation/SegmentedControl',
  component: SegmentedControl
} as Meta

export const Default: StoryFn = () => (
  <SegmentedControl initialValue="week" aria-label="Period">
    <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
    <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
    <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
  </SegmentedControl>
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = useState<string | number>('list')
  return (
    <SegmentedControl value={value} onChange={setValue} aria-label="View">
      <SegmentedControl.Item value="list">List</SegmentedControl.Item>
      <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      <SegmentedControl.Item value="board" disabled>
        Board
      </SegmentedControl.Item>
    </SegmentedControl>
  )
}

export const FullWidth: StoryFn = () => (
  <SegmentedControl fullWidth initialValue="a" aria-label="Plan">
    <SegmentedControl.Item value="a">Monthly</SegmentedControl.Item>
    <SegmentedControl.Item value="b">Yearly</SegmentedControl.Item>
  </SegmentedControl>
)

export const Disabled: StoryFn = () => (
  <SegmentedControl disabled initialValue="a" aria-label="Plan">
    <SegmentedControl.Item value="a">Monthly</SegmentedControl.Item>
    <SegmentedControl.Item value="b">Yearly</SegmentedControl.Item>
  </SegmentedControl>
)
