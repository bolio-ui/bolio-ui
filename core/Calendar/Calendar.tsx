import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import {
  addDays,
  addMonths,
  clampDate,
  isSameDay,
  startOfDay,
  toISO
} from './date-utils'
import styles from './Calendar.module.css'

interface Props {
  value?: Date | null
  onChange?: (date: Date) => void
  min?: Date
  max?: Date
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  autoFocus?: boolean
  previousLabel?: string
  nextLabel?: string
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'onChange'
>
export type CalendarProps = Props & NativeAttrs

const CalendarComponent = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value: customValue,
      onChange,
      min,
      max,
      locale = 'en-US',
      weekStartsOn = 0,
      autoFocus = false,
      previousLabel = 'Previous month',
      nextLabel = 'Next month',
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

    const [selfValue, setSelfValue] = useState<Date | null>(null)
    const selected = customValue !== undefined ? customValue : selfValue
    const [focused, setFocused] = useState(() =>
      clampDate(startOfDay(selected || new Date()), minDay, maxDay)
    )

    const gridRef = useRef<HTMLTableElement>(null)
    // The DOM focus only follows the focused day after the keyboard or on mount.
    const moveFocus = useRef(autoFocus)

    const time = selected ? selected.getTime() : null
    useEffect(() => {
      if (time === null) return
      setFocused(clampDate(startOfDay(new Date(time)), minDay, maxDay))
    }, [time, minDay, maxDay])

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
        ...Array.from({ length: offset }, () => null),
        ...Array.from(
          { length: total },
          (_, index) => new Date(year, month, index + 1)
        )
      ]
      while (cells.length % 7) cells.push(null)
      return Array.from({ length: cells.length / 7 }, (_, index) =>
        cells.slice(index * 7, index * 7 + 7)
      )
    }, [year, month, weekStartsOn])

    const isDisabled = (date: Date) =>
      Boolean((minDay && date < minDay) || (maxDay && date > maxDay))

    const today = new Date()
    const previousDisabled = Boolean(
      minDay && new Date(year, month, 0) < minDay
    )
    const nextDisabled = Boolean(
      maxDay && new Date(year, month + 1, 1) > maxDay
    )

    const select = (date: Date) => {
      if (isDisabled(date)) return
      setFocused(date)
      if (customValue === undefined) setSelfValue(date)
      if (onChange) onChange(date)
    }

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
      '--calendar-selected-color': theme.palette.background,
      '--calendar-selected-bg': theme.palette.primary,
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
        >
          <thead>
            <tr role="row">
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
            {weeks.map((week, index) => (
              <tr key={index} role="row">
                {week.map((date, cell) =>
                  date ? (
                    <td
                      key={cell}
                      role="gridcell"
                      className={styles.td}
                      aria-selected={Boolean(
                        selected && isSameDay(date, selected)
                      )}
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
                            [styles.selected]: Boolean(
                              selected && isSameDay(date, selected)
                            ),
                            [styles.today]: isSameDay(date, today)
                          }
                        )}
                        tabIndex={isSameDay(date, focused) ? 0 : -1}
                        disabled={isDisabled(date)}
                        onClick={() => select(date)}
                        onKeyDown={(event) => keyDownHandler(event, date)}
                      >
                        {date.getDate()}
                      </button>
                    </td>
                  ) : (
                    <td
                      key={cell}
                      role="gridcell"
                      className={styles.td}
                      aria-hidden="true"
                    />
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)

CalendarComponent.displayName = 'BolioUICalendar'
const Calendar = withScale(CalendarComponent)
export default Calendar
