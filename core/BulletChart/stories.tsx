import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import BulletChart from '.'

export default {
  title: 'Data Display/BulletChart',
  component: BulletChart
} as Meta

const ranges = [
  { value: 150, label: 'Poor' },
  { value: 225, label: 'Fair' },
  { value: 300, label: 'Good' }
]

export const Default: StoryFn = () => (
  <BulletChart
    aria-label="Revenue"
    label="Revenue"
    value={270}
    target={250}
    ranges={ranges}
  />
)

export const Vertical: StoryFn = () => (
  <BulletChart
    aria-label="Stock"
    orientation="vertical"
    value={72}
    target={60}
    ranges={ranges}
  />
)
