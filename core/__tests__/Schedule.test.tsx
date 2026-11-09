import React from 'react'
import { render, screen, fireEvent, within, act } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Schedule } from '..'
import type { ScheduleEvent } from '..'
import {
  layoutColumns,
  overlapsDay,
  segmentOn,
  startOfWeek,
  isAllDay
} from '../Schedule/schedule-utils'

// Monday, November 9 2026
const now = new Date(2026, 10, 9, 10, 30)
const at = (day: number, hour: number, minute = 0) =>
  new Date(2026, 10, day, hour, minute)

const events: ScheduleEvent[] = [
  { id: 1, title: 'Standup', start: at(9, 9), end: at(9, 9, 30) },
  {
    id: 2,
    title: 'Design review',
    start: at(9, 9),
    end: at(9, 10, 30),
    color: '#8b5cf6'
  },
  { id: 3, title: 'Lunch', start: at(10, 12), end: at(10, 13) },
  { id: 4, title: 'Offsite', start: at(11, 0), end: at(12, 0), allDay: true }
]

const draw = (props: Partial<React.ComponentProps<typeof Schedule>> = {}) =>
  render(
    <BolioUIProvider>
      <Schedule
        events={events}
        initialDate={now}
        getNow={() => now}
        {...props}
      />
    </BolioUIProvider>
  )

const day = (name: string) =>
  screen.getByRole('group', { name: new RegExp(name) })

describe('schedule utils', () => {
  it('finds the start of the week', () => {
    expect(startOfWeek(at(9, 15), 0)).toEqual(at(8, 0))
    expect(startOfWeek(at(9, 15), 1)).toEqual(at(9, 0))
    expect(startOfWeek(at(8, 15), 1)).toEqual(at(2, 0))
  })

  it('knows which days an event touches', () => {
    const night = { id: 1, title: 'x', start: at(9, 22), end: at(10, 2) }
    expect(overlapsDay(night, at(9, 0))).toBe(true)
    expect(overlapsDay(night, at(10, 0))).toBe(true)
    expect(overlapsDay(night, at(11, 0))).toBe(false)
    // ends exactly at midnight: it does not touch the next day
    const edge = { id: 2, title: 'x', start: at(9, 22), end: at(10, 0) }
    expect(overlapsDay(edge, at(10, 0))).toBe(false)
    // no length: the day it starts on
    const point = { id: 3, title: 'x', start: at(9, 8), end: at(9, 8) }
    expect(overlapsDay(point, at(9, 0))).toBe(true)
    expect(overlapsDay(point, at(10, 0))).toBe(false)
  })

  it('cuts an event to the part inside a day, in minutes', () => {
    const night = { id: 1, title: 'x', start: at(9, 22), end: at(10, 2) }
    expect(segmentOn(night, at(9, 0))).toEqual({ start: 22 * 60, end: 24 * 60 })
    expect(segmentOn(night, at(10, 0))).toEqual({ start: 0, end: 2 * 60 })
  })

  it('treats a whole day or more as all day', () => {
    expect(
      isAllDay({
        id: 1,
        title: 'x',
        start: at(9, 0),
        end: at(9, 1),
        allDay: true
      })
    ).toBe(true)
    expect(
      isAllDay({ id: 1, title: 'x', start: at(9, 0), end: at(10, 0) })
    ).toBe(true)
    expect(
      isAllDay({ id: 1, title: 'x', start: at(9, 0), end: at(9, 5) })
    ).toBe(false)
  })

  it('gives events that do not overlap the whole width', () => {
    expect(
      layoutColumns([
        { start: 0, end: 60 },
        { start: 60, end: 120 }
      ])
    ).toEqual([
      { column: 0, columns: 1 },
      { column: 0, columns: 1 }
    ])
  })

  it('splits the width between events that overlap', () => {
    expect(
      layoutColumns([
        { start: 0, end: 60 },
        { start: 30, end: 90 }
      ])
    ).toEqual([
      { column: 0, columns: 2 },
      { column: 1, columns: 2 }
    ])
  })

  it('reuses a column that is free again, inside a chain of overlaps', () => {
    const result = layoutColumns([
      { start: 0, end: 60 },
      { start: 30, end: 120 },
      { start: 70, end: 100 }
    ])
    expect(result[0]).toEqual({ column: 0, columns: 2 })
    expect(result[1]).toEqual({ column: 1, columns: 2 })
    expect(result[2]).toEqual({ column: 0, columns: 2 })
  })

  it('starts over for a group that is apart', () => {
    const result = layoutColumns([
      { start: 0, end: 60 },
      { start: 30, end: 90 },
      { start: 200, end: 260 }
    ])
    expect(result[2]).toEqual({ column: 0, columns: 1 })
  })
})

describe('<Schedule /> week', () => {
  it('shows the week of the date, with a title and seven days', () => {
    draw()
    expect(
      screen.getByRole('heading', { name: /Nov 8\s*–\s*14, 2026/ })
    ).toBeInTheDocument()
    expect(
      screen
        .getAllByRole('group')
        .filter((g) => /2026$/.test(g.getAttribute('aria-label') || ''))
    ).toHaveLength(7)
    expect(
      screen.getByRole('button', { name: 'Monday, November 9, 2026' })
    ).toHaveAttribute('aria-current', 'date')
  })

  it('puts each event in its day, named with its time', () => {
    draw()
    expect(
      within(day('Monday, November 9')).getByRole('button', {
        name: /Standup, 9:00 AM – 9:30 AM/
      })
    ).toBeInTheDocument()
    expect(
      within(day('Tuesday, November 10')).getByRole('button', { name: /Lunch/ })
    ).toBeInTheDocument()
    expect(within(day('Monday, November 9')).queryByText('Lunch')).toBeNull()
  })

  it('places an event by its time and length', () => {
    draw({ slotHeight: 48 })
    const block = within(day('Tuesday, November 10')).getByRole('button', {
      name: /Lunch/
    })
    // 12:00 is 12 hours down, one hour long
    expect(block.style.top).toBe('576px')
    expect(block.style.height).toBe('48px')
  })

  it('puts events that overlap side by side', () => {
    draw()
    const monday = within(day('Monday, November 9'))
    const a = monday.getByRole('button', { name: /Standup/ })
    const b = monday.getByRole('button', { name: /Design review/ })
    expect(a.style.width).toBe('50%')
    expect(b.style.width).toBe('50%')
    expect(new Set([a.style.left, b.style.left])).toEqual(
      new Set(['0%', '50%'])
    )
  })

  it('keeps a short event readable', () => {
    draw({
      events: [{ id: 1, title: 'Quick', start: at(9, 9), end: at(9, 9, 5) }]
    })
    const block = within(day('Monday, November 9')).getByRole('button', {
      name: /Quick/
    })
    expect(parseInt(block.style.height)).toBeGreaterThanOrEqual(20)
  })

  it('lists all-day events in their own row, and not in the grid', () => {
    draw()
    expect(screen.getByText('All day')).toBeInTheDocument()
    expect(
      within(day('Wednesday, November 11')).queryByText('Offsite')
    ).toBeNull()
    expect(
      screen.getByRole('button', { name: /Offsite, All day/ })
    ).toBeInTheDocument()
  })

  it('has no all-day row when there is nothing to show in it', () => {
    draw({ events: [events[0]] })
    expect(screen.queryByText('All day')).toBeNull()
  })

  it('draws the current time on today only', () => {
    draw({ slotHeight: 48 })
    const line = screen.getByTestId('schedule-now')
    // 10:30 is 10.5 hours down
    expect(line.style.top).toBe('504px')
    expect(within(day('Monday, November 9')).getByTestId('schedule-now')).toBe(
      line
    )
    expect(screen.getAllByTestId('schedule-now')).toHaveLength(1)
  })

  it('can leave out the current time line', () => {
    draw({ withCurrentTimeIndicator: false })
    expect(screen.queryByTestId('schedule-now')).toBeNull()
  })

  it('shows only the hours asked for', () => {
    draw({ startHour: 8, endHour: 18, slotHeight: 40 })
    const block = within(day('Tuesday, November 10')).getByRole('button', {
      name: /Lunch/
    })
    expect(block.style.top).toBe('160px')
    expect(screen.queryByText('Standup')).not.toBeNull()
  })

  it('starts the week where weekStartsOn says', () => {
    draw({ weekStartsOn: 1 })
    expect(
      screen.getByRole('heading', { name: /Nov 9\s*–\s*15, 2026/ })
    ).toBeInTheDocument()
  })

  it('reports the event that is clicked', () => {
    const onEventClick = jest.fn()
    draw({ onEventClick })
    fireEvent.click(screen.getByRole('button', { name: /Lunch/ }))
    expect(onEventClick).toHaveBeenCalledWith(events[2])
  })
})

describe('<Schedule /> navigation', () => {
  it('goes to the next and previous week, and back to today', () => {
    draw()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      screen.getByRole('heading', { name: /Nov 15\s*–\s*21, 2026/ })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    expect(
      screen.getByRole('heading', { name: /Nov 1\s*–\s*7, 2026/ })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Today' }))
    expect(
      screen.getByRole('heading', { name: /Nov 8\s*–\s*14, 2026/ })
    ).toBeInTheDocument()
  })

  it('reports the new date, and follows a controlled date', () => {
    const onDateChange = jest.fn()
    const { rerender } = render(
      <BolioUIProvider>
        <Schedule
          events={events}
          date={now}
          onDateChange={onDateChange}
          getNow={() => now}
        />
      </BolioUIProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(onDateChange).toHaveBeenCalledWith(at(16, 0))
    // controlled: the view did not move until the parent says so
    expect(
      screen.getByRole('heading', { name: /Nov 8\s*–\s*14, 2026/ })
    ).toBeInTheDocument()
    rerender(
      <BolioUIProvider>
        <Schedule
          events={events}
          date={at(16, 0)}
          onDateChange={onDateChange}
          getNow={() => now}
        />
      </BolioUIProvider>
    )
    expect(
      screen.getByRole('heading', { name: /Nov 15\s*–\s*21, 2026/ })
    ).toBeInTheDocument()
  })

  it('switches between the views, and tells which one is on', () => {
    const onViewChange = jest.fn()
    draw({ onViewChange })
    expect(screen.getByRole('button', { name: 'Week' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    fireEvent.click(screen.getByRole('button', { name: 'Day' }))
    expect(onViewChange).toHaveBeenCalledWith('day')
    expect(screen.getByRole('button', { name: 'Day' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(
      screen.getByRole('heading', { name: 'Monday, November 9, 2026' })
    ).toBeInTheDocument()
  })

  it('offers only the views it is given', () => {
    draw({ views: ['week'] })
    expect(screen.queryByRole('group', { name: 'View' })).toBeNull()
  })

  it('opens a day from its number', () => {
    const onDayClick = jest.fn()
    draw({ onDayClick })
    fireEvent.click(
      screen.getByRole('button', { name: 'Tuesday, November 10, 2026' })
    )
    expect(onDayClick).toHaveBeenCalledWith(at(10, 0))
    expect(
      screen.getByRole('heading', { name: 'Tuesday, November 10, 2026' })
    ).toBeInTheDocument()
  })

  it('uses the labels and the language it is given', () => {
    draw({
      locale: 'pt-BR',
      labels: { today: 'Hoje', next: 'Próximo', previous: 'Anterior' }
    })
    expect(screen.getByRole('button', { name: 'Hoje' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /nov\.? de 2026|8 a 14 de nov/i })
    ).toBeInTheDocument()
  })
})

describe('<Schedule /> day', () => {
  it('shows one day', () => {
    draw({ initialView: 'day' })
    expect(
      screen
        .getAllByRole('group')
        .filter((g) => /2026$/.test(g.getAttribute('aria-label') || ''))
    ).toHaveLength(1)
    expect(screen.getByRole('button', { name: /Standup/ })).toBeInTheDocument()
    expect(screen.queryByText('Lunch')).toBeNull()
  })

  it('moves one day at a time', () => {
    draw({ initialView: 'day' })
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      screen.getByRole('heading', { name: 'Tuesday, November 10, 2026' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Lunch/ })).toBeInTheDocument()
  })
})

describe('<Schedule /> slots', () => {
  it('has no slots to click unless onSlotClick is given', () => {
    draw()
    expect(
      screen.queryAllByRole('button', { name: /Monday, November 9, 2026, \d/ })
    ).toHaveLength(0)
  })

  it('reports the start and the end of the slot that is clicked', () => {
    const onSlotClick = jest.fn()
    draw({ onSlotClick, intervalMinutes: 30 })
    fireEvent.click(
      screen.getByRole('button', { name: 'Monday, November 9, 2026, 2:30 PM' })
    )
    expect(onSlotClick).toHaveBeenCalledWith(at(9, 14, 30), at(9, 15, 0))
  })

  it('has one tab stop among the slots, and the arrows move between them', () => {
    draw({ onSlotClick: jest.fn() })
    const slots = screen.getAllByRole('button', { name: /, \d+:00 [AP]M$/ })
    expect(
      slots.filter((s) => s.getAttribute('tabindex') === '0')
    ).toHaveLength(1)
    const first = screen.getByRole('button', {
      name: 'Sunday, November 8, 2026, 12:00 AM'
    })
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(
      screen.getByRole('button', { name: 'Sunday, November 8, 2026, 1:00 AM' })
    ).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' })
    expect(
      screen.getByRole('button', { name: 'Monday, November 9, 2026, 1:00 AM' })
    ).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' })
    expect(
      screen.getByRole('button', { name: 'Monday, November 9, 2026, 11:00 PM' })
    ).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'Home' })
    expect(
      screen.getByRole('button', { name: 'Monday, November 9, 2026, 12:00 AM' })
    ).toHaveFocus()
    // the edge stays put
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' })
    expect(
      screen.getByRole('button', { name: 'Monday, November 9, 2026, 12:00 AM' })
    ).toHaveFocus()
  })
})

describe('<Schedule /> month', () => {
  const monthEvents: ScheduleEvent[] = [
    ...events,
    { id: 5, title: 'Extra A', start: at(9, 13), end: at(9, 14) },
    { id: 6, title: 'Extra B', start: at(9, 15), end: at(9, 16) }
  ]

  it('is a table of the weeks of the month, named by the month', () => {
    draw({ initialView: 'month', events: monthEvents })
    const table = screen.getByRole('table', { name: 'November 2026' })
    expect(within(table).getAllByRole('columnheader')).toHaveLength(7)
    // November 2026 starts on a Sunday and has 30 days: 5 weeks
    expect(within(table).getAllByRole('row')).toHaveLength(6)
  })

  it('lists the events of a day, and cuts after maxEventsPerDay with a +N more', () => {
    draw({ initialView: 'month', events: monthEvents, maxEventsPerDay: 2 })
    const cell = screen
      .getByRole('button', { name: 'Monday, November 9, 2026' })
      .closest('td') as HTMLElement
    expect(
      within(cell).getAllByRole('button', { name: /,/ }).length
    ).toBeGreaterThan(0)
    expect(
      within(cell).getByRole('button', { name: '+2 more' })
    ).toBeInTheDocument()
  })

  it('opens the day from +N more', () => {
    draw({ initialView: 'month', events: monthEvents, maxEventsPerDay: 2 })
    fireEvent.click(screen.getByRole('button', { name: '+2 more' }))
    expect(
      screen.getByRole('heading', { name: 'Monday, November 9, 2026' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Day' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('writes the time before a timed event, but not before an all-day one', () => {
    draw({ initialView: 'month', events: monthEvents })
    expect(
      screen.getByRole('button', { name: /Lunch, 12:00 PM/ })
    ).toHaveTextContent('12:00 PM')
    expect(
      screen.getByRole('button', { name: /Offsite, All day/ })
    ).not.toHaveTextContent('12:00')
  })

  it('shows a multi day event on every day it covers', () => {
    draw({
      initialView: 'month',
      events: [
        { id: 9, title: 'Trip', start: at(10, 0), end: at(13, 0), allDay: true }
      ]
    })
    expect(screen.getAllByRole('button', { name: /Trip/ })).toHaveLength(3)
  })

  it('moves a month at a time', () => {
    draw({ initialView: 'month' })
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      screen.getByRole('table', { name: 'December 2026' })
    ).toBeInTheDocument()
  })

  it('has one tab stop among the days, and the arrows move between them', () => {
    draw({ initialView: 'month' })
    const days = screen.getAllByRole('button', { name: /, 2026$/ })
    expect(days.filter((d) => d.getAttribute('tabindex') === '0')).toHaveLength(
      1
    )
    const first = days[0]
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(days[1]).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
    expect(days[8]).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' })
    expect(days[13]).toHaveFocus()
  })
})

describe('<Schedule /> time', () => {
  it('moves the current time line as time passes', () => {
    jest.useFakeTimers()
    let clock = at(9, 10, 0)
    draw({ getNow: () => clock })
    expect(screen.getByTestId('schedule-now').style.top).toBe('480px')
    clock = at(9, 11, 0)
    act(() => {
      jest.advanceTimersByTime(60000)
    })
    expect(screen.getByTestId('schedule-now').style.top).toBe('528px')
    jest.useRealTimers()
  })
})

describe('<Schedule /> accessibility', () => {
  it('forwards the ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <BolioUIProvider>
        <Schedule ref={ref} getNow={() => now} />
      </BolioUIProvider>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it.each(['day', 'week', 'month'] as const)(
    'has no violations in the %s view',
    async (initialView) => {
      const { container } = draw({ initialView, onSlotClick: jest.fn() })
      const result = await axe.run(container, {
        rules: {
          region: { enabled: false },
          'color-contrast': { enabled: false }
        }
      })
      expect(result.violations.map((v) => v.id)).toEqual([])
    }
  )
})
