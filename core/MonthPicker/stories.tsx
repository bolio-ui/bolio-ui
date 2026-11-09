import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import MonthPicker from '.'

export default {
  title: 'Data Entry/MonthPicker',
  component: MonthPicker
} as Meta

export const Default: StoryFn = () => <MonthPicker />

export const Limits: StoryFn = () => (
  <MonthPicker min={new Date(2026, 2, 1)} max={new Date(2026, 8, 1)} />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState<Date | null>(null)
  return <MonthPicker value={value} onChange={setValue} />
}
