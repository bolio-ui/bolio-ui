import { addDays, startOfDay } from '../Calendar/date-utils'

export interface ScheduleEvent {
  id: string | number
  title: string
  start: Date
  end: Date
  // any CSS color, the theme primary when missing
  color?: string
  allDay?: boolean
  // your own data, handed back by the callbacks
  payload?: unknown
}

export const startOfWeek = (date: Date, weekStartsOn: number) =>
  addDays(startOfDay(date), -((date.getDay() - weekStartsOn + 7) % 7))

export const minutesOf = (date: Date) =>
  date.getHours() * 60 + date.getMinutes()

// Whether any part of the event falls on that day. An event with no length
// belongs to the day it starts on.
export const overlapsDay = (event: ScheduleEvent, day: Date) => {
  const from = startOfDay(day).getTime()
  const to = addDays(day, 1).getTime()
  const start = event.start.getTime()
  const end = event.end.getTime()
  if (end <= start) return start >= from && start < to
  return start < to && end > from
}

// The part of an event inside one day, in minutes from midnight
export const segmentOn = (event: ScheduleEvent, day: Date) => {
  const from = startOfDay(day).getTime()
  const to = addDays(day, 1).getTime()
  const start = Math.max(event.start.getTime(), from)
  const end = Math.min(Math.max(event.end.getTime(), event.start.getTime()), to)
  return {
    start: Math.round((start - from) / 60000),
    end: Math.round((end - from) / 60000)
  }
}

// An event that fills whole days goes in the all-day row, not the grid
export const isAllDay = (event: ScheduleEvent) =>
  Boolean(event.allDay) ||
  event.end.getTime() - event.start.getTime() >= 24 * 60 * 60 * 1000

export const byStart = (a: ScheduleEvent, b: ScheduleEvent) =>
  a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime()

export interface Slot {
  column: number
  columns: number
}

// Events that overlap share the width of the day: each takes a column, and
// every event of a group of overlaps is as wide as the group has columns.
export const layoutColumns = (
  items: Array<{ start: number; end: number }>
): Slot[] => {
  const order = items
    .map((_, index) => index)
    .sort(
      (a, b) => items[a].start - items[b].start || items[b].end - items[a].end
    )
  const result: Slot[] = items.map(() => ({ column: 0, columns: 1 }))
  let group: number[] = []
  let groupEnd = -Infinity
  let ends: number[] = []

  const close = () => {
    group.forEach((index) => {
      result[index].columns = ends.length
    })
    group = []
    ends = []
    groupEnd = -Infinity
  }

  order.forEach((index) => {
    const item = items[index]
    if (item.start >= groupEnd) close()
    let column = ends.findIndex((end) => end <= item.start)
    if (column < 0) {
      column = ends.length
      ends.push(item.end)
    } else ends[column] = item.end
    result[index].column = column
    group.push(index)
    groupEnd = Math.max(groupEnd, item.end)
  })
  close()
  return result
}
