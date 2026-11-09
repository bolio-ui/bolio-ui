import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import TimePicker from '.'

export default {
  title: 'Data Entry/TimePicker',
  component: TimePicker
} as Meta

export const Default: StoryFn = () => <TimePicker aria-label="Time" />

export const WithSeconds: StoryFn = () => (
  <TimePicker aria-label="Time" withSeconds initialValue="09:30:15" />
)

export const TwelveHours: StoryFn = () => (
  <TimePicker aria-label="Time" format="12h" initialValue="15:45" />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState('08:00')
  return <TimePicker aria-label="Time" value={value} onChange={setValue} />
}
