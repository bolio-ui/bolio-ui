import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import DateTimePicker from '.'

export default {
  title: 'Data Entry/DateTimePicker',
  component: DateTimePicker
} as Meta

export const Default: StoryFn = () => <DateTimePicker dateLabel="Date" />

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState<Date | null>(
    new Date(2026, 10, 12, 9, 30)
  )
  return <DateTimePicker dateLabel="Date" value={value} onChange={setValue} />
}
