import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import MiniCalendar from '.'

export default {
  title: 'Data Entry/MiniCalendar',
  component: MiniCalendar
} as Meta

export const Default: StoryFn = () => <MiniCalendar />

export const FiveDays: StoryFn = () => <MiniCalendar numberOfDays={5} />

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState<Date | null>(null)
  return <MiniCalendar value={value} onChange={setValue} />
}
