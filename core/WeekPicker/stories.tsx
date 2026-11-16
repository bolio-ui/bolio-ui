import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import WeekPicker from '.'
import type { Week } from '.'

export default {
  title: 'Data Entry/WeekPicker',
  component: WeekPicker
} as Meta

export const Default: StoryFn = () => <WeekPicker />

export const MondayFirst: StoryFn = () => <WeekPicker weekStartsOn={1} />

export const Controlled: StoryFn = () => {
  const [week, setWeek] = React.useState<Week | null>(null)
  return <WeekPicker value={week} onChange={setWeek} />
}
