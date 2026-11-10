import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Sparkline from '.'

export default {
  title: 'Data Display/Sparkline',
  component: Sparkline
} as Meta

const data = [12, 18, 14, 22, 30, 28, 41]

export const Default: StoryFn = () => (
  <Sparkline aria-label="Weekly visits" data={data} />
)

export const Trend: StoryFn = () => (
  <>
    <Sparkline trend aria-label="Rising" data={data} />
    <Sparkline trend aria-label="Falling" data={[...data].reverse()} />
  </>
)

export const WithGaps: StoryFn = () => (
  <>
    <Sparkline aria-label="With gaps" data={[3, 5, null, 8, 6]} />
    <Sparkline connectNulls aria-label="Connected" data={[3, 5, null, 8, 6]} />
  </>
)
