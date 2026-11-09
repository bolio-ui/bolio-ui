import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Heatmap from '.'

export default {
  title: 'Data Display/Heatmap',
  component: Heatmap
} as Meta

const data = {
  '2026-01-05': 1,
  '2026-01-12': 5,
  '2026-02-03': 4,
  '2026-02-17': 8,
  '2026-03-10': 6
}
const range = { startDate: '2026-01-01', endDate: '2026-03-31' }

export const Default: StoryFn = () => (
  <Heatmap aria-label="Commits" data={data} {...range} />
)

export const WithLegend: StoryFn = () => (
  <Heatmap data={data} {...range} withLegend type="primary" />
)

export const SundayFirst: StoryFn = () => (
  <Heatmap data={data} {...range} firstDayOfWeek={0} locale="pt-BR" />
)
