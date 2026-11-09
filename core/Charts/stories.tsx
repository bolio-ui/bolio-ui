import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart
} from '.'

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

export const Radar: StoryFn = () => (
  <RadarChart
    data={[
      { skill: 'Speed', anna: 80, ben: 60 },
      { skill: 'Power', anna: 50, ben: 90 },
      { skill: 'Technique', anna: 70, ben: 70 },
      { skill: 'Defense', anna: 40, ben: 55 },
      { skill: 'Stamina', anna: 85, ben: 65 }
    ]}
    dataKey="skill"
    series={[{ name: 'anna' }, { name: 'ben' }]}
    withLegend
  />
)

export const Scatter: StoryFn = () => (
  <ScatterChart
    xAxisLabel="Age"
    yAxisLabel="Weight"
    data={[
      {
        name: 'people',
        points: [
          { x: 18, y: 62 },
          { x: 31, y: 78 },
          { x: 45, y: 85 },
          { x: 60, y: 76 }
        ]
      }
    ]}
  />
)
