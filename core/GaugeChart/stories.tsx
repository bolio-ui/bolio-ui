import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import GaugeChart from '.'

export default {
  title: 'Data Display/GaugeChart',
  component: GaugeChart
} as Meta

export const Default: StoryFn = () => (
  <GaugeChart aria-label="CPU load" value={64} />
)

export const Sections: StoryFn = () => (
  <GaugeChart
    aria-label="Temperature"
    value={72}
    max={120}
    target={72}
    sections={[
      { value: 60, color: '#16a34a' },
      { value: 90, color: '#f59e0b' },
      { value: 120, color: '#dc2626' }
    ]}
  />
)

export const HalfCircle: StoryFn = () => (
  <GaugeChart
    aria-label="Half"
    value={40}
    startAngle={-90}
    endAngle={90}
    roundCaps
  />
)
