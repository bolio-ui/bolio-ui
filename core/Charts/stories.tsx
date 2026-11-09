import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import {
  AreaChart,
  BarChart,
  BubbleChart,
  CandlestickChart,
  CompositeChart,
  DonutChart,
  FunnelChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  SankeyChart,
  ScatterChart,
  Treemap
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

const traffic = [
  { month: 'Jan', visits: 120, sales: 40, rate: 3.3 },
  { month: 'Feb', visits: 180, sales: 55, rate: 3.0 },
  { month: 'Mar', visits: 150, sales: 80, rate: 5.3 }
]

export const Composite: StoryFn = () => (
  <CompositeChart
    data={traffic}
    dataKey="month"
    withLegend
    series={[
      { name: 'visits', label: 'Visits', type: 'bar' },
      { name: 'sales', label: 'Sales', type: 'area' },
      { name: 'rate', label: 'Rate', type: 'line' }
    ]}
  />
)

export const Funnel: StoryFn = () => (
  <FunnelChart
    data={[
      { name: 'Visits', value: 1000 },
      { name: 'Sign ups', value: 400 },
      { name: 'Paid', value: 120 }
    ]}
  />
)

export const RadialBar: StoryFn = () => (
  <RadialBarChart withLegend data={slices} />
)

export const TreemapStory: StoryFn = () => (
  <Treemap
    data={[
      { name: 'North', value: 400 },
      { name: 'South', value: 300 },
      { name: 'East', value: 200 }
    ]}
  />
)

export const Sankey: StoryFn = () => (
  <SankeyChart
    data={{
      nodes: [{ name: 'Visits' }, { name: 'Pricing' }, { name: 'Buy' }],
      links: [
        { source: 0, target: 1, value: 100 },
        { source: 1, target: 2, value: 30 }
      ]
    }}
  />
)

export const Bubble: StoryFn = () => (
  <BubbleChart
    xAxisLabel="Orders"
    yAxisLabel="Spend"
    data={[
      {
        name: 'retail',
        points: [
          { x: 10, y: 400, z: 120 },
          { x: 25, y: 900, z: 60 }
        ]
      }
    ]}
  />
)

export const Candlestick: StoryFn = () => (
  <CandlestickChart
    dataKey="day"
    data={[
      { day: 'Mon', open: 100, high: 120, low: 95, close: 115 },
      { day: 'Tue', open: 115, high: 118, low: 100, close: 104 }
    ]}
  />
)
