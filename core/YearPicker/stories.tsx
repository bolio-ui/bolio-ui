import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import YearPicker from '.'

export default {
  title: 'Data Entry/YearPicker',
  component: YearPicker
} as Meta

export const Default: StoryFn = () => <YearPicker />

export const Limits: StoryFn = () => (
  <YearPicker min={new Date(2022, 0, 1)} max={new Date(2028, 0, 1)} />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState<Date | null>(null)
  return <YearPicker value={value} onChange={setValue} />
}
