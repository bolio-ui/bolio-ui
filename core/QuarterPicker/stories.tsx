import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import QuarterPicker from '.'

export default {
  title: 'Data Entry/QuarterPicker',
  component: QuarterPicker
} as Meta

export const Default: StoryFn = () => <QuarterPicker />

export const Limits: StoryFn = () => (
  <QuarterPicker min={new Date(2026, 3, 1)} max={new Date(2026, 9, 1)} />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState<Date | null>(null)
  return <QuarterPicker value={value} onChange={setValue} />
}
