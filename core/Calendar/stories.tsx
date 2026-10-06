import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Calendar from '.'
import type { DateRange } from '.'
import Text from '../Text'

export default {
  title: 'Data Entry/Calendar',
  component: Calendar
} as Meta

export const Default: StoryFn = () => {
  const [date, setDate] = useState<Date | null>(new Date())
  return (
    <>
      <Calendar value={date} onChange={setDate} />
      <Text small>Selected: {date ? date.toDateString() : 'none'}</Text>
    </>
  )
}

export const MinAndMax: StoryFn = () => {
  const today = new Date()
  const min = new Date(today.getFullYear(), today.getMonth(), 5)
  const max = new Date(today.getFullYear(), today.getMonth(), 25)
  return <Calendar min={min} max={max} />
}

export const Portuguese: StoryFn = () => (
  <Calendar locale="pt-BR" weekStartsOn={1} />
)

export const Multiple: StoryFn = () => {
  const [dates, setDates] = useState<Date[]>([])
  return <Calendar mode="multiple" value={dates} onChange={setDates} />
}

export const Range: StoryFn = () => {
  const [range, setRange] = useState<DateRange>([null, null])
  return <Calendar mode="range" value={range} onChange={setRange} />
}

export const DisabledWeekends: StoryFn = () => (
  <Calendar shouldDisableDate={(date) => [0, 6].includes(date.getDay())} />
)

export const OutsideDaysAndWeekNumbers: StoryFn = () => (
  <Calendar weekStartsOn={1} showOutsideDays showWeekNumbers />
)
