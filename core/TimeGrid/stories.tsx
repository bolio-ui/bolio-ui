import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import TimeGrid from '.'

export default {
  title: 'Data Entry/TimeGrid',
  component: TimeGrid
} as Meta

export const Default: StoryFn = () => <TimeGrid />

export const TwelveHours: StoryFn = () => (
  <TimeGrid format="12h" locale="en-US" initialValue="14:00" />
)

export const Disabled: StoryFn = () => (
  <TimeGrid disabledTimes={['10:00', '10:30', '15:00']} allowDeselect />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState('')
  return <TimeGrid value={value} onChange={setValue} />
}
