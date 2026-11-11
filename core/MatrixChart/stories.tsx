import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import MatrixChart from '.'

export default {
  title: 'Data Display/MatrixChart',
  component: MatrixChart
} as Meta

const data = [
  { x: 'Mon', y: 'api', value: 4 },
  { x: 'Tue', y: 'api', value: 7 },
  { x: 'Wed', y: 'api', value: 2 },
  { x: 'Mon', y: 'web', value: 1 },
  { x: 'Tue', y: 'web', value: null },
  { x: 'Wed', y: 'web', value: 5 }
]

export const Default: StoryFn = () => (
  <MatrixChart aria-label="Deploys" data={data} />
)

export const WithLegend: StoryFn = () => (
  <MatrixChart data={data} withLegend type="info" cellSize={36} />
)
