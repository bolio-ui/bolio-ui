import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import BarsList from '.'

export default {
  title: 'Data Display/BarsList',
  component: BarsList
} as Meta

const data = [
  { name: 'React', value: 950000 },
  { name: 'Vue', value: 420000 },
  { name: 'Svelte', value: 120000 }
]

export const Default: StoryFn = () => (
  <BarsList barsLabel="Library" valueLabel="Downloads" data={data} />
)

export const Colors: StoryFn = () => (
  <BarsList
    data={[
      { name: 'Paid', value: 80, color: '#16a34a' },
      { name: 'Pending', value: 35, color: '#f59e0b' },
      { name: 'Failed', value: 8, color: '#dc2626' }
    ]}
    valueFormatter={(value) => `${value}%`}
  />
)
