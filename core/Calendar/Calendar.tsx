import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import type { ScaleComponent } from '../use-scale/with-scale'
import useClasses, { joinClasses } from '../use-classes'
import {
  addDays,
  addMonths,
  clampDate,
  getISOWeek,
  isSameDay,
  startOfDay,
  toISO
} from './date-utils'
import styles from './Calendar.module.css'

export type DateRange = [Date | null, Date | null]

interface BaseProps {
  min?: Date
  max?: Date
  shouldDisableDate?: (date: Date) => boolean
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  showOutsideDays?: boolean
  showWeekNumbers?: boolean
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  autoFocus?: boolean
  previousLabel?: string
  nextLabel?: string
  weekLabel?: string
  className?: string
}

interface SingleProps {
  mode?: 'single'
  value?: Date | null
  onChange?: (date: Date) => void
}

interface MultipleProps {
  mode: 'multiple'
  value?: Date[]
  onChange?: (dates: Date[]) => void
  maxSelected?: number
}

interface RangeProps {
  mode: 'range'
  value?: DateRange
  onChange?: (range: DateRange) => void
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof BaseProps | keyof SingleProps | keyof MultipleProps | 'onChange'
>
export type CalendarProps = BaseProps &
  (SingleProps | MultipleProps | RangeProps) &
  NativeAttrs

type CalendarValue = Date | null | Date[] | DateRange
type ImplProps = BaseProps & {
  mode?: 'single' | 'multiple' | 'range'
  value?: CalendarValue
  onChange?: (value: never) => void
  maxSelected?: number
} & NativeAttrs

const CalendarComponent = React.forwardRef<HTMLDivElement, ImplProps>(
  (
    {
      mode = 'single',
      value: customValue,
      onChange,
      maxSelected,
      min,
      max,
      shouldDisableDate,
      locale = 'en-US',
      weekStartsOn = 0,
      showOutsideDays = false,
      showWeekNumbers = false,
      month: customMonth,
      defaultMonth,
      onMonthChange,
      autoFocus = false,
      previousLabel = 'Previous month',
      nextLabel = 'Next month',
      weekLabel = 'Week',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const headingId = useId()

    const minDay = useMemo(() => (min ? startOfDay(min) : undefined), [min])
    const maxDay = useMemo(() => (max ? startOfDay(max) : undefined), [max])

    const [selfValue, setSelfValue] = useState<CalendarValue>(
      mode === 'multiple' ? [] : mode === 'range' ? [null, null] : null
    )
    const current = customValue !== undefined ? customValue : selfValue
    const isRange = mode === 'range'
    const [rangeStart, rangeEnd] = isRange ? (current as DateRange) : []
    const selectedDays: Date[] = isRange
      ? ([rangeStart, rangeEnd].filter(Boolean) as Date[])
      : mode === 'multiple'
        ? (current as Date[])
        : current
          ? [current as Date]
          : []
    const anchor = selectedDays[0] || null
    const [hovered, setHovered] = useState<Date | null>(null)
    const [focused, setFocused] = useState(() =>
      clampDate(
        startOfDay(anchor || customMonth || defaultMonth || new Date()),
        minDay,
        maxDay
      )
    )

    const gridRef = useRef<HTMLTableElement>(null)
    // The DOM focus only follows the focused day after the keyboard or on mount.
    const moveFocus = useRef(autoFocus)

    const time = anchor ? anchor.getTime() : null
    useEffect(() => {
      if (time === null) return
      setFocused(clampDate(startOfDay(new Date(time)), minDay, maxDay))
    }, [time, minDay, maxDay])

    const monthTime = customMonth
      ? new Date(customMonth.getFullYear(), customMonth.getMonth(), 1).getTime()
      : null
    useEffect(() => {
      if (monthTime === null) return
      const target = new Date(monthTime)
      setFocused((last) =>
        last.getFullYear() === target.getFullYear() &&
        last.getMonth() === target.getMonth()
          ? last
          : clampDate(target, minDay, maxDay)
      )
    }, [monthTime, minDay, maxDay])

    useEffect(() => {
      if (!moveFocus.current) return
      moveFocus.current = false
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${toISO(focused)}"]`)
        ?.focus()
    }, [focused])

    const formats = useMemo(
      () => ({
        month: new Intl.DateTimeFormat(locale, {
          month: 'long',
          year: 'numeric'
        }),
        day: new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        short: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
        long: new Intl.DateTimeFormat(locale, { weekday: 'long' })
      }),
      [locale]
    )

    const weekdays = useMemo(
      () =>
        Array.from({ length: 7 }, (_, index) => {
          // 2023-01-01 is a Sunday
          const date = new Date(2023, 0, 1 + ((weekStartsOn + index) % 7))
          return {
            short: formats.short.format(date),
            long: formats.long.format(date)
          }
        }),
      [formats, weekStartsOn]
    )

    const year = focused.getFullYear()
    const month = focused.getMonth()
    const weeks = useMemo(() => {
      const offset = (new Date(year, month, 1).getDay() - weekStartsOn + 7) % 7
      const total = new Date(year, month + 1, 0).getDate()
      const cells: Array<Date | null> = [
        ...Array.from({ length: offset }, (_, index) =>
          showOutsideDays ? new Date(year, month, index - offset + 1) : null
        ),
        ...Array.from(
          { length: total },
          (_, index) => new Date(year, month, index + 1)
        )
      ]
      while (cells.length % 7)
        cells.push(
          showOutsideDays
            ? new Date(year, month, cells.length - offset + 1)
            : null
        )
      return Array.from({ length: cells.length / 7 }, (_, index) =>
        cells.slice(index * 7, index * 7 + 7)
      )
    }, [year, month, weekStartsOn, showOutsideDays])

    const lastMonth = useRef(`${year}-${month}`)
    useEffect(() => {
      const key = `${year}-${month}`
      if (key === lastMonth.current) return
      lastMonth.current = key
      if (onMonthChange) onMonthChange(new Date(year, month, 1))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, month])

    const isDisabled = (date: Date) =>
      Boolean(
        (minDay && date < minDay) ||
        (maxDay && date > maxDay) ||
        (shouldDisableDate && shouldDisableDate(date))
      )

    const today = new Date()
    const previousDisabled = Boolean(
      minDay && new Date(year, month, 0) < minDay
    )
    const nextDisabled = Boolean(
      maxDay && new Date(year, month + 1, 1) > maxDay
    )

    const commit = (next: CalendarValue) => {
      if (customValue === undefined) setSelfValue(next)
      if (onChange) (onChange as (value: CalendarValue) => void)(next)
    }

    const select = (date: Date) => {
      if (isDisabled(date)) return
      setFocused(date)
      if (isRange) {
        const start = rangeStart as Date | null
        const startsNew = !start || rangeEnd || date < start
        return commit(startsNew ? [date, null] : [start, date])
      }
      if (mode === 'multiple') {
        const list = current as Date[]
        if (list.some((item) => isSameDay(item, date)))
          return commit(list.filter((item) => !isSameDay(item, date)))
        if (maxSelected !== undefined && list.length >= maxSelected) return
        return commit([...list, date].sort((a, b) => +a - +b))
      }
      commit(date)
    }

    const isSelected = (date: Date) =>
      selectedDays.some((item) => isSameDay(item, date))

    // while the range has only a start, the hovered day previews the end
    const previewEnd = isRange ? rangeEnd || hovered : null
    const [low, high] =
      rangeStart && previewEnd
        ? rangeStart <= previewEnd
          ? [rangeStart, previewEnd]
          : [previewEnd, rangeStart]
        : [null, null]
    const isInRange = (date: Date) =>
      Boolean(low && high && date > low && date < high)

    const keyDownHandler = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      date: Date
    ) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        return select(date)
      }
      const weekIndex = (date.getDay() - weekStartsOn + 7) % 7
      const targets: Record<string, Date> = {
        ArrowLeft: addDays(date, -1),
        ArrowRight: addDays(date, 1),
        ArrowUp: addDays(date, -7),
        ArrowDown: addDays(date, 7),
        Home: addDays(date, -weekIndex),
        End: addDays(date, 6 - weekIndex),
        PageUp: addMonths(date, event.shiftKey ? -12 : -1),
        PageDown: addMonths(date, event.shiftKey ? 12 : 1)
      }
      if (!(event.key in targets)) return
      event.preventDefault()
      moveFocus.current = true
      setFocused(clampDate(targets[event.key], minDay, maxDay))
    }

    const calendarStyle = {
      '--calendar-font-size': SCALES.font(1),
      '--calendar-text-color': theme.palette.foreground,
      '--calendar-width': SCALES.width(1, 'auto'),
      '--calendar-height': SCALES.height(1, 'auto'),
      '--calendar-padding-top': SCALES.pt(0),
      '--calendar-padding-right': SCALES.pr(0),
      '--calendar-padding-bottom': SCALES.pb(0),
      '--calendar-padding-left': SCALES.pl(0),
      '--calendar-margin-top': SCALES.mt(0),
      '--calendar-margin-right': SCALES.mr(0),
      '--calendar-margin-bottom': SCALES.mb(0),
      '--calendar-margin-left': SCALES.ml(0),
      '--calendar-weekday-color': theme.palette.accents_5,
      '--calendar-radius': theme.layout.radius,
      '--calendar-hover-bg': theme.palette.accents_2,
      '--calendar-focus-outline': theme.palette.primary,
      '--calendar-disabled-color': theme.palette.accents_3,
      '--calendar-today-border': theme.palette.accents_4,
      '--calendar-selected-color': '#fff',
      '--calendar-selected-bg': theme.palette.primary,
      '--calendar-range-bg': `color-mix(in srgb, ${theme.palette.primary} 18%, transparent)`,
      '--calendar-outside-color': theme.palette.accents_4,
      '--calendar-week-color': theme.palette.accents_4,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.calendar, className)}
        style={calendarStyle}
        {...props}
      >
        <div className={styles.header}>
          <button
            type="button"
            className={joinClasses(styles.button, styles.navButton)}
            aria-label={previousLabel}
            disabled={previousDisabled}
            onClick={() =>
              setFocused(clampDate(addMonths(focused, -1), minDay, maxDay))
            }
          >
            ‹
          </button>
          <div id={headingId} className={styles.title} aria-live="polite">
            {formats.month.format(focused)}
          </div>
          <button
            type="button"
            className={joinClasses(styles.button, styles.navButton)}
            aria-label={nextLabel}
            disabled={nextDisabled}
            onClick={() =>
              setFocused(clampDate(addMonths(focused, 1), minDay, maxDay))
            }
          >
            ›
          </button>
        </div>
        <table
          ref={gridRef}
          role="grid"
          aria-labelledby={headingId}
          className={styles.table}
          aria-multiselectable={mode !== 'single' || undefined}
          onMouseLeave={() => setHovered(null)}
        >
          <thead>
            <tr role="row">
              {showWeekNumbers && (
                <th role="columnheader" className={styles.th} />
              )}
              {weekdays.map((weekday) => (
                <th
                  key={weekday.long}
                  role="columnheader"
                  scope="col"
                  className={styles.th}
                >
                  <abbr title={weekday.long}>{weekday.short}</abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, index) => {
              const reference = week.find(Boolean) as Date
              const weekNumber = getISOWeek(
                addDays(reference, 3 - week.indexOf(reference))
              )
              return (
                <tr key={index} role="row">
                  {showWeekNumbers && (
                    <th
                      role="rowheader"
                      scope="row"
                      className={styles.weekNumber}
                      aria-label={`${weekLabel} ${weekNumber}`}
                    >
                      {weekNumber}
                    </th>
                  )}
                  {week.map((date, cell) => {
                    if (!date)
                      return (
                        <td
                          key={cell}
                          role="gridcell"
                          className={styles.td}
                          aria-hidden="true"
                        />
                      )
                    const selectedDay = isSelected(date)
                    const outside = date.getMonth() !== month
                    return (
                      <td
                        key={cell}
                        role="gridcell"
                        className={joinClasses(styles.td, {
                          [styles.inRange]: isInRange(date),
                          [styles.rangeStart]: Boolean(
                            low && isSameDay(date, low) && high
                          ),
                          [styles.rangeEnd]: Boolean(
                            high && isSameDay(date, high) && low
                          )
                        })}
                        aria-selected={selectedDay || isInRange(date)}
                      >
                        <button
                          type="button"
                          data-date={toISO(date)}
                          aria-label={formats.day.format(date)}
                          aria-current={
                            isSameDay(date, today) ? 'date' : undefined
                          }
                          className={joinClasses(
                            styles.button,
                            styles.dayButton,
                            {
                              [styles.selected]: selectedDay,
                              [styles.today]: isSameDay(date, today),
                              [styles.outside]: outside
                            }
                          )}
                          tabIndex={isSameDay(date, focused) ? 0 : -1}
                          disabled={isDisabled(date)}
                          onClick={() => select(date)}
                          onMouseEnter={() => isRange && setHovered(date)}
                          onKeyDown={(event) => keyDownHandler(event, date)}
                        >
                          {date.getDate()}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
)

CalendarComponent.displayName = 'BolioUICalendar'
const Calendar = withScale(CalendarComponent) as ScaleComponent<
  HTMLDivElement,
  CalendarProps
>
export default Calendar
