import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import DateRangePicker from '.'
import type { DateRange } from '../Calendar'

export default {
  title: 'Data Entry/DateRangePicker',
  component: DateRangePicker
} as Meta

export const Default: StoryFn = () => <DateRangePicker aria-label="Stay" />

export const Controlled: StoryFn = () => {
  const [range, setRange] = useState<DateRange>([
    new Date(2026, 9, 5),
    new Date(2026, 9, 12)
  ])
  return <DateRangePicker aria-label="Stay" value={range} onChange={setRange} />
}

export const Limits: StoryFn = () => (
  <DateRangePicker
    aria-label="Stay"
    min={new Date(2026, 9, 1)}
    max={new Date(2026, 9, 31)}
  />
)

export const Disabled: StoryFn = () => (
  <DateRangePicker disabled aria-label="Stay" />
)
