import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import WaffleChart from '.'

export default {
  title: 'Data Display/WaffleChart',
  component: WaffleChart
} as Meta

const data = [
  { name: 'Chrome', value: 65 },
  { name: 'Safari', value: 25 },
  { name: 'Other', value: 10 }
]

export const Default: StoryFn = () => (
  <WaffleChart aria-label="Browser share" data={data} />
)

export const WithTotal: StoryFn = () => (
  <WaffleChart
    total={200}
    rows={5}
    columns={20}
    size={400}
    data={[{ name: 'Done', value: 70 }]}
  />
)
