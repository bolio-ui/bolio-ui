import React, { useEffect, useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import {
  addDays,
  addMonths,
  isSameDay,
  startOfDay
} from '../Calendar/date-utils'
import {
  byStart,
  isAllDay,
  layoutColumns,
  minutesOf,
  overlapsDay,
  segmentOn,
  startOfWeek
} from './schedule-utils'
import type { ScheduleEvent } from './schedule-utils'
import useGridFocus from './use-grid-focus'
import styles from './Schedule.module.css'

export type ScheduleView = 'day' | 'week' | 'month'

export interface ScheduleLabels {
  today: string
  previous: string
  next: string
  view: string
  day: string
  week: string
  month: string
  allDay: string
  // the text of the "+N more" button of a month day
  more: (count: number) => string
}

const defaultLabels: ScheduleLabels = {
  today: 'Today',
  previous: 'Previous',
  next: 'Next',
  view: 'View',
  day: 'Day',
  week: 'Week',
  month: 'Month',
  allDay: 'All day',
  more: (count) => `+${count} more`
}

interface Props {
  events?: ScheduleEvent[]
  view?: ScheduleView
  initialView?: ScheduleView
  onViewChange?: (view: ScheduleView) => void
  date?: Date
  initialDate?: Date
  onDateChange?: (date: Date) => void
  views?: ScheduleView[]
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  startHour?: number
  endHour?: number
  slotHeight?: number
  intervalMinutes?: number
  height?: number
  startScrollHour?: number
  maxEventsPerDay?: number
  withCurrentTimeIndicator?: boolean
  getNow?: () => Date
  labels?: Partial<ScheduleLabels>
  onEventClick?: (event: ScheduleEvent) => void
  onSlotClick?: (start: Date, end: Date) => void
  onDayClick?: (date: Date) => void
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type ScheduleProps = Props & NativeAttrs

const MIN_EVENT_HEIGHT = 20

const ScheduleComponent = React.forwardRef<HTMLDivElement, ScheduleProps>(
  (
    {
      events = [],
      view: customView,
      initialView = 'week',
      onViewChange,
      date: customDate,
      initialDate,
      onDateChange,
      views = ['day', 'week', 'month'],
      locale = 'en-US',
      weekStartsOn = 0,
      startHour = 0,
      endHour = 24,
      slotHeight = 48,
      intervalMinutes = 60,
      height = 600,
      startScrollHour = 7,
      maxEventsPerDay = 3,
      withCurrentTimeIndicator = true,
      getNow,
      labels: customLabels,
      onEventClick,
      onSlotClick,
      onDayClick,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const labels = { ...defaultLabels, ...customLabels }

    const [selfView, setSelfView] = useState<ScheduleView>(initialView)
    const [selfDate, setSelfDate] = useState(() =>
      startOfDay(initialDate || (getNow ? getNow() : new Date()))
    )
    const view = customView || selfView
    const date = startOfDay(customDate || selfDate)

    const changeView = (next: ScheduleView) => {
      if (!customView) setSelfView(next)
      if (onViewChange) onViewChange(next)
    }
    const changeDate = (next: Date) => {
      const day = startOfDay(next)
      if (!customDate) setSelfDate(day)
      if (onDateChange) onDateChange(day)
    }

    const [now, setNow] = useState(() => (getNow ? getNow() : new Date()))
    useEffect(() => {
      if (!withCurrentTimeIndicator) return
      const timer = setInterval(
        () => setNow(getNow ? getNow() : new Date()),
        60000
      )
      return () => clearInterval(timer)
    }, [withCurrentTimeIndicator, getNow])

    const formats = useMemo(
      () => ({
        long: new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
        weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
        month: new Intl.DateTimeFormat(locale, {
          month: 'long',
          year: 'numeric'
        }),
        short: new Intl.DateTimeFormat(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        time: new Intl.DateTimeFormat(locale, {
          hour: 'numeric',
          minute: '2-digit'
        }),
        hour: new Intl.DateTimeFormat(locale, { hour: 'numeric' })
      }),
      [locale]
    )

    // The days each view lays out
    const days = useMemo(() => {
      if (view === 'day') return [date]
      if (view === 'week') {
        const first = startOfWeek(date, weekStartsOn)
        return Array.from({ length: 7 }, (_, i) => addDays(first, i))
      }
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const first = startOfWeek(monthStart, weekStartsOn)
      const length = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate()
      const offset = (monthStart.getDay() - weekStartsOn + 7) % 7
      return Array.from(
        { length: Math.ceil((offset + length) / 7) * 7 },
        (_, i) => addDays(first, i)
      )
    }, [view, date, weekStartsOn])

    const title =
      view === 'day'
        ? formats.long.format(date)
        : view === 'month'
          ? formats.month.format(date)
          : (() => {
              const range = formats.short as Intl.DateTimeFormat & {
                formatRange?: (a: Date, b: Date) => string
              }
              const [first, last] = [days[0], days[days.length - 1]]
              return range.formatRange
                ? range.formatRange(first, last)
                : `${formats.short.format(first)} – ${formats.short.format(last)}`
            })()

    const step = (direction: 1 | -1) =>
      changeDate(
        view === 'month'
          ? addMonths(date, direction)
          : addDays(date, direction * (view === 'week' ? 7 : 1))
      )

    const openDay = (day: Date) => {
      changeDate(day)
      changeView('day')
      if (onDayClick) onDayClick(day)
    }

    const sorted = useMemo(() => [...events].sort(byStart), [events])
    const timeRange = (event: ScheduleEvent) =>
      isAllDay(event)
        ? labels.allDay
        : `${formats.time.format(event.start)} – ${formats.time.format(event.end)}`
    const eventLabel = (event: ScheduleEvent) =>
      `${event.title}, ${timeRange(event)}`

    const palette = theme.palette
    const rootStyle = {
      '--schedule-slot-height': `${slotHeight}px`,
      '--schedule-columns': view === 'month' ? 7 : days.length,
      '--schedule-bg': palette.background,
      '--schedule-text-color': palette.foreground,
      '--schedule-muted-color': palette.accents_5,
      '--schedule-border-color': palette.border,
      '--schedule-hover-bg': palette.accents_2,
      '--schedule-today-bg': palette.primary,
      '--schedule-focus-color': palette.primary,
      '--schedule-now-color': palette.error,
      '--schedule-event-color': palette.primary,
      '--schedule-radius': theme.layout.radius,
      width: SCALES.width(1, '100%'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    const chip = (event: ScheduleEvent, compact = false) => (
      <button
        key={event.id}
        type="button"
        className={joinClasses(styles.event, { [styles.compact]: compact })}
        style={
          event.color
            ? ({ '--schedule-event-color': event.color } as React.CSSProperties)
            : undefined
        }
        aria-label={eventLabel(event)}
        onClick={() => onEventClick && onEventClick(event)}
      >
        {compact && !isAllDay(event) && (
          <span className={styles.time}>
            {formats.time.format(event.start)}
          </span>
        )}
        <span className={styles.name}>{event.title}</span>
      </button>
    )

    // ---- the time grid, for the day and week views
    const hours = Array.from(
      { length: endHour - startHour },
      (_, i) => startHour + i
    )
    const totalHeight = (endHour - startHour) * slotHeight
    const slotsPerDay = Math.floor(
      ((endHour - startHour) * 60) / intervalMinutes
    )
    const slotGrid = useGridFocus(slotsPerDay, days.length, 'column')
    const dayGrid = useGridFocus(Math.ceil(days.length / 7), 7, 'row')
    const body = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (view === 'month' || !body.current) return
      body.current.scrollTop = Math.max(
        0,
        (startScrollHour - startHour) * slotHeight
      )
    }, [view, startScrollHour, startHour, slotHeight])

    const allDayByDay = days.map((day) =>
      sorted.filter((event) => isAllDay(event) && overlapsDay(event, day))
    )
    const hasAllDay = allDayByDay.some((list) => list.length > 0)

    const renderTimeGrid = () => (
      <>
        <div className={styles.head}>
          <div className={styles.corner} />
          {days.map((day) => (
            <div
              key={day.getTime()}
              className={joinClasses(styles.dayHead, {
                [styles.today]: isSameDay(day, now)
              })}
            >
              <span className={styles.weekday}>
                {formats.weekday.format(day)}
              </span>
              <button
                type="button"
                className={styles.dayNumber}
                aria-label={formats.long.format(day)}
                aria-current={isSameDay(day, now) ? 'date' : undefined}
                onClick={() => openDay(day)}
              >
                {day.getDate()}
              </button>
            </div>
          ))}
        </div>
        {hasAllDay && (
          <div className={styles.allDay}>
            <div className={styles.corner}>{labels.allDay}</div>
            {days.map((day, index) => (
              <div key={day.getTime()} className={styles.allDayCell}>
                {allDayByDay[index].map((event) => chip(event))}
              </div>
            ))}
          </div>
        )}
        <div ref={body} className={styles.body} style={{ height }}>
          <div className={styles.timeline} style={{ height: totalHeight }}>
            <div className={styles.hours} aria-hidden="true">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className={styles.hour}
                  style={{ top: (hour - startHour) * slotHeight }}
                >
                  {hour > startHour &&
                    formats.hour.format(new Date(2000, 0, 1, hour))}
                </div>
              ))}
            </div>
            {days.map((day, columnIndex) => {
              const timed = sorted.filter(
                (event) => !isAllDay(event) && overlapsDay(event, day)
              )
              const segments = timed
                .map((event) => ({ event, ...segmentOn(event, day) }))
                .filter(
                  (item) =>
                    item.end > startHour * 60 && item.start < endHour * 60
                )
              const layout = layoutColumns(segments)
              return (
                <div
                  key={day.getTime()}
                  className={styles.column}
                  role="group"
                  aria-label={formats.long.format(day)}
                >
                  {onSlotClick &&
                    Array.from({ length: slotsPerDay }, (_, slot) => {
                      const from = startHour * 60 + slot * intervalMinutes
                      const start = new Date(
                        day.getFullYear(),
                        day.getMonth(),
                        day.getDate(),
                        0,
                        from
                      )
                      const end = new Date(
                        start.getTime() + intervalMinutes * 60000
                      )
                      return (
                        <button
                          key={slot}
                          ref={slotGrid.register(slot, columnIndex)}
                          type="button"
                          className={styles.slot}
                          style={{
                            top: ((slot * intervalMinutes) / 60) * slotHeight,
                            height: (intervalMinutes / 60) * slotHeight
                          }}
                          tabIndex={slotGrid.tabIndex(slot, columnIndex)}
                          aria-label={`${formats.long.format(day)}, ${formats.time.format(start)}`}
                          onFocus={slotGrid.onFocus(slot, columnIndex)}
                          onKeyDown={slotGrid.onKeyDown(slot, columnIndex)}
                          onClick={() => onSlotClick(start, end)}
                        />
                      )
                    })}
                  {segments.map((item, index) => {
                    const top = Math.max(item.start - startHour * 60, 0)
                    const bottom =
                      Math.min(item.end, endHour * 60) - startHour * 60
                    const { column, columns } = layout[index]
                    return (
                      <button
                        key={item.event.id}
                        type="button"
                        className={styles.block}
                        style={
                          {
                            top: (top / 60) * slotHeight,
                            height: Math.max(
                              ((bottom - top) / 60) * slotHeight,
                              MIN_EVENT_HEIGHT
                            ),
                            left: `${(column / columns) * 100}%`,
                            width: `${100 / columns}%`,
                            ...(item.event.color
                              ? { '--schedule-event-color': item.event.color }
                              : {})
                          } as React.CSSProperties
                        }
                        aria-label={eventLabel(item.event)}
                        onClick={() => onEventClick && onEventClick(item.event)}
                      >
                        <span className={styles.name}>{item.event.title}</span>
                        <span className={styles.range}>
                          {formats.time.format(item.event.start)}
                        </span>
                      </button>
                    )
                  })}
                  {withCurrentTimeIndicator &&
                    isSameDay(day, now) &&
                    minutesOf(now) >= startHour * 60 &&
                    minutesOf(now) < endHour * 60 && (
                      <div
                        className={styles.now}
                        data-testid="schedule-now"
                        style={{
                          top:
                            ((minutesOf(now) - startHour * 60) / 60) *
                            slotHeight
                        }}
                        aria-hidden="true"
                      />
                    )}
                </div>
              )
            })}
          </div>
        </div>
      </>
    )

    // ---- the month grid
    const weeks = Array.from({ length: days.length / 7 }, (_, row) =>
      days.slice(row * 7, row * 7 + 7)
    )
    const renderMonth = () => (
      <table className={styles.month} aria-label={title}>
        <thead>
          <tr>
            {days.slice(0, 7).map((day) => (
              <th
                key={day.getTime()}
                scope="col"
                className={styles.weekdayHead}
              >
                <abbr title={formats.weekdayLong.format(day)}>
                  {formats.weekday.format(day)}
                </abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, row) => (
            <tr key={row}>
              {week.map((day, col) => {
                const list = sorted.filter((event) => overlapsDay(event, day))
                const shown = list.slice(0, maxEventsPerDay)
                const hidden = list.length - shown.length
                return (
                  <td
                    key={day.getTime()}
                    className={joinClasses(styles.cell, {
                      [styles.outside]: day.getMonth() !== date.getMonth()
                    })}
                  >
                    <button
                      ref={dayGrid.register(row, col)}
                      type="button"
                      className={joinClasses(styles.dayNumber, {
                        [styles.today]: isSameDay(day, now)
                      })}
                      tabIndex={dayGrid.tabIndex(row, col)}
                      aria-label={formats.long.format(day)}
                      aria-current={isSameDay(day, now) ? 'date' : undefined}
                      onFocus={dayGrid.onFocus(row, col)}
                      onKeyDown={dayGrid.onKeyDown(row, col)}
                      onClick={() => openDay(day)}
                    >
                      {day.getDate()}
                    </button>
                    <div className={styles.events}>
                      {shown.map((event) => chip(event, true))}
                      {hidden > 0 && (
                        <button
                          type="button"
                          className={styles.more}
                          onClick={() => openDay(day)}
                        >
                          {labels.more(hidden)}
                        </button>
                      )}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )

    return (
      <div
        ref={ref}
        className={useClasses(styles.schedule, className)}
        style={rootStyle}
        {...props}
      >
        <div className={styles.header}>
          <div className={styles.nav}>
            <button
              type="button"
              className={styles.control}
              aria-label={labels.previous}
              onClick={() => step(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              className={styles.control}
              onClick={() => changeDate(getNow ? getNow() : new Date())}
            >
              {labels.today}
            </button>
            <button
              type="button"
              className={styles.control}
              aria-label={labels.next}
              onClick={() => step(1)}
            >
              ›
            </button>
          </div>
          <h2 className={styles.title} aria-live="polite">
            {title}
          </h2>
          {views.length > 1 && (
            <div role="group" aria-label={labels.view} className={styles.views}>
              {views.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={joinClasses(styles.control, {
                    [styles.active]: item === view
                  })}
                  aria-pressed={item === view}
                  onClick={() => changeView(item)}
                >
                  {labels[item]}
                </button>
              ))}
            </div>
          )}
        </div>
        {view === 'month' ? renderMonth() : renderTimeGrid()}
      </div>
    )
  }
)

ScheduleComponent.displayName = 'BolioUISchedule'
const Schedule = withScale(ScheduleComponent)
export default Schedule
