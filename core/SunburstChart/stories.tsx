import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import SunburstChart from '.'

export default {
  title: 'Data Display/SunburstChart',
  component: SunburstChart
} as Meta

const data = [
  {
    name: 'Europe',
    color: '#60a5fa',
    children: [
      { name: 'Spain', value: 40 },
      { name: 'France', value: 60 }
    ]
  },
  {
    name: 'Americas',
    color: '#16a34a',
    children: [
      { name: 'Brazil', value: 90 },
      { name: 'Chile', value: 30 }
    ]
  }
]

export const Default: StoryFn = () => (
  <SunburstChart aria-label="Sales by region" data={data} />
)

export const WithLabels: StoryFn = () => (
  <SunburstChart data={data} withLabels size={400} />
)
