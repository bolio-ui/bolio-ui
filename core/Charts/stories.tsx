import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import { AreaChart, BarChart, DonutChart, LineChart, PieChart } from '.'

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

const slices = [
  { name: 'Direct', value: 300 },
  { name: 'Search', value: 500 },
  { name: 'Social', value: 200 }
]

export const Pie: StoryFn = () => (
  <PieChart data={slices} withLegend withLabels labelsType="percent" />
)

export const Donut: StoryFn = () => (
  <DonutChart data={slices} withLegend chartLabel="1,000" />
)
