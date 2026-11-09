import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Schedule from '.'

export default {
  title: 'Data Display/Schedule',
  component: Schedule
} as Meta

const at = (day: number, hour: number, minute = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + day)
  date.setHours(hour, minute, 0, 0)
  return date
}

const events = [
  { id: 1, title: 'Standup', start: at(0, 9), end: at(0, 9, 30) },
  {
    id: 2,
    title: 'Design review',
    start: at(0, 9),
    end: at(0, 10, 30),
    color: '#8b5cf6'
  },
  { id: 3, title: 'Lunch', start: at(1, 12), end: at(1, 13), color: '#16a34a' },
  { id: 4, title: 'Offsite', start: at(2, 0), end: at(3, 0), allDay: true }
]

export const Week: StoryFn = () => <Schedule events={events} height={420} />

export const Day: StoryFn = () => (
  <Schedule events={events} initialView="day" height={420} />
)

export const Month: StoryFn = () => (
  <Schedule events={events} initialView="month" />
)
