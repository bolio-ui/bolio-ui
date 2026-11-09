import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import { AreaChart, BarChart, LineChart } from '.'

export default {
  title: 'Data Display/Charts',
  component: LineChart
} as Meta

const data = [
  { month: 'Jan', visits: 120, sales: 40 },
  { month: 'Feb', visits: 180, sales: 55 },
  { month: 'Mar', visits: 150, sales: 80 },
  { month: 'Apr', visits: 220, sales: 95 }
]
const series = [
  { name: 'visits', label: 'Visits' },
  { name: 'sales', label: 'Sales' }
]

export const Line: StoryFn = () => (
  <LineChart data={data} dataKey="month" series={series} withLegend />
)

export const Area: StoryFn = () => (
  <AreaChart data={data} dataKey="month" series={series} stacked withLegend />
)

export const Bar: StoryFn = () => (
  <BarChart data={data} dataKey="month" series={series} withLegend />
)
