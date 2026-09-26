import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import {
  addDays,
  addMonths,
  clampDate,
  isSameDay,
  startOfDay,
  toISO
} from './date-utils'

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

    return (
      <div ref={ref} className={useClasses('calendar', className)} {...props}>
        <div className="header">
          <button
            type="button"
            aria-label={previousLabel}
            disabled={previousDisabled}
            onClick={() =>
              setFocused(clampDate(addMonths(focused, -1), minDay, maxDay))
            }
          >
            ‹
          </button>
          <div id={headingId} className="title" aria-live="polite">
            {formats.month.format(focused)}
          </div>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={nextDisabled}
            onClick={() =>
              setFocused(clampDate(addMonths(focused, 1), minDay, maxDay))
            }
          >
            ›
          </button>
        </div>
        <table ref={gridRef} role="grid" aria-labelledby={headingId}>
          <thead>
            <tr role="row">
              {weekdays.map((weekday) => (
                <th key={weekday.long} role="columnheader" scope="col">
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
                        className={useClasses({
                          selected: Boolean(
                            selected && isSameDay(date, selected)
                          ),
                          today: isSameDay(date, today)
                        })}
                        tabIndex={isSameDay(date, focused) ? 0 : -1}
                        disabled={isDisabled(date)}
                        onClick={() => select(date)}
                        onKeyDown={(event) => keyDownHandler(event, date)}
                      >
                        {date.getDate()}
                      </button>
                    </td>
                  ) : (
                    <td key={cell} role="gridcell" aria-hidden="true" />
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <style jsx>{`
          .calendar {
            display: inline-block;
            font-size: ${SCALES.font(1)};
            color: ${theme.palette.foreground};
            width: ${SCALES.width(1, 'auto')};
            height: ${SCALES.height(1, 'auto')};
            padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
              ${SCALES.pl(0)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.5em;
          }
          .title {
            font-weight: 600;
            text-transform: capitalize;
          }
          table {
            border-collapse: collapse;
          }
          th {
            padding: 0.25em 0;
            font-size: 0.75em;
            font-weight: 500;
            color: ${theme.palette.accents_5};
          }
          th abbr {
            text-decoration: none;
          }
          td {
            padding: 1px;
            text-align: center;
          }
          button {
            font: inherit;
            color: inherit;
            cursor: pointer;
            background: transparent;
            border: 1px solid transparent;
            border-radius: ${theme.layout.radius};
          }
          .header button {
            width: 2em;
            height: 2em;
            font-size: 1.25em;
            line-height: 1;
          }
          td button {
            width: 2.5em;
            height: 2.5em;
          }
          button:hover:not(:disabled) {
            background-color: ${theme.palette.accents_2};
          }
          button:focus-visible {
            outline: 2px solid ${theme.palette.primary};
            outline-offset: 1px;
          }
          button:disabled {
            cursor: not-allowed;
            color: ${theme.palette.accents_3};
          }
          .today {
            border-color: ${theme.palette.accents_4};
          }
          .selected,
          .selected:hover:not(:disabled) {
            color: ${theme.palette.background};
            background-color: ${theme.palette.primary};
            border-color: ${theme.palette.primary};
          }
        `}</style>
      </div>
    )
  }
)

CalendarComponent.displayName = 'BolioUICalendar'
const Calendar = withScale(CalendarComponent)
export default Calendar
