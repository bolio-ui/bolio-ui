import React, { useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import type { ScaleComponent } from '../use-scale/with-scale'
import useClasses, { joinClasses } from '../use-classes'
import useUncontrolled from '../use-uncontrolled'
import { addDays, isSameDay, startOfDay } from '../Calendar/date-utils'
import styles from './MiniCalendar.module.css'

interface Props {
  value?: Date | null
  initialValue?: Date | null
  onChange?: (date: Date) => void
  // first day of the strip when there is no value, today by default
  defaultDate?: Date
  numberOfDays?: number
  min?: Date
  max?: Date
  shouldDisableDate?: (date: Date) => boolean
  locale?: string
  previousLabel?: string
  nextLabel?: string
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'onChange' | 'defaultValue'
>
export type MiniCalendarProps = Props & NativeAttrs

const MiniCalendarComponent = React.forwardRef<
  HTMLDivElement,
  MiniCalendarProps
>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      defaultDate,
      numberOfDays = 7,
      min,
      max,
      shouldDisableDate,
      locale,
      previousLabel = 'Previous days',
      nextLabel = 'Next days',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [value, setValue] = useUncontrolled<Date | null>({
      value: customValue,
      defaultValue: initialValue,
      onChange: (date) => date && onChange?.(date)
    })

    const [start, setStart] = useState(() =>
      startOfDay(value || defaultDate || new Date())
    )
    const days = Array.from({ length: numberOfDays }, (_, i) =>
      addDays(start, i)
    )
    const today = new Date()

    const formats = useMemo(
      () => ({
        weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
        long: new Intl.DateTimeFormat(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        title: new Intl.DateTimeFormat(locale, {
          month: 'long',
          year: 'numeric'
        })
      }),
      [locale]
    )

    const isDisabled = (date: Date) =>
      Boolean(
        (min && date < startOfDay(min)) ||
        (max && date > startOfDay(max)) ||
        (shouldDisableDate && shouldDisableDate(date))
      )

    // The month or the two months the strip covers.
    const first = days[0]
    const last = days[days.length - 1]
    const title =
      first.getMonth() === last.getMonth() &&
      first.getFullYear() === last.getFullYear()
        ? formats.title.format(first)
        : `${formats.title.format(first)} – ${formats.title.format(last)}`

    const enabled = days.filter((day) => !isDisabled(day))
    const selectedDay = days.find((day) => value && isSameDay(day, value))
    const tabStop =
      selectedDay && !isDisabled(selectedDay) ? selectedDay : enabled[0]
    const buttons = useRef(new Map<number, HTMLButtonElement>())

    const keyDownHandler = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      day: Date
    ) => {
      const index = enabled.findIndex((item) => isSameDay(item, day))
      const targets: Record<string, number> = {
        ArrowLeft: index - 1,
        ArrowRight: index + 1,
        Home: 0,
        End: enabled.length - 1
      }
      if (!(event.key in targets)) return
      event.preventDefault()
      const target =
        enabled[Math.min(Math.max(targets[event.key], 0), enabled.length - 1)]
      buttons.current.get(target.getTime())?.focus()
    }

    const miniStyle = {
      '--mini-calendar-font-size': SCALES.font(0.875),
      '--mini-calendar-width': SCALES.width(1, 'auto'),
      '--mini-calendar-padding-top': SCALES.pt(0),
      '--mini-calendar-padding-right': SCALES.pr(0),
      '--mini-calendar-padding-bottom': SCALES.pb(0),
      '--mini-calendar-padding-left': SCALES.pl(0),
      '--mini-calendar-margin-top': SCALES.mt(0),
      '--mini-calendar-margin-right': SCALES.mr(0),
      '--mini-calendar-margin-bottom': SCALES.mb(0),
      '--mini-calendar-margin-left': SCALES.ml(0),
      '--mini-calendar-text-color': theme.palette.foreground,
      '--mini-calendar-muted-color': theme.palette.accents_5,
      '--mini-calendar-radius': theme.layout.radius,
      '--mini-calendar-hover-bg': theme.palette.accents_2,
      '--mini-calendar-focus-outline': theme.palette.primary,
      '--mini-calendar-disabled-color': theme.palette.accents_3,
      '--mini-calendar-today-border': theme.palette.accents_4,
      '--mini-calendar-selected-color': '#fff',
      '--mini-calendar-selected-bg': theme.palette.primary,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.root, className)}
        style={miniStyle}
        {...props}
      >
        <div className={styles.header}>
          <button
            type="button"
            className={styles.nav}
            aria-label={previousLabel}
            onClick={() => setStart(addDays(start, -numberOfDays))}
          >
            ‹
          </button>
          <div className={styles.title} aria-live="polite">
            {title}
          </div>
          <button
            type="button"
            className={styles.nav}
            aria-label={nextLabel}
            onClick={() => setStart(addDays(start, numberOfDays))}
          >
            ›
          </button>
        </div>
        <div role="group" aria-label={title} className={styles.days}>
          {days.map((day) => {
            const selected = Boolean(value && isSameDay(day, value))
            return (
              <button
                key={day.getTime()}
                ref={(element) => {
                  if (element) buttons.current.set(day.getTime(), element)
                  else buttons.current.delete(day.getTime())
                }}
                type="button"
                aria-label={formats.long.format(day)}
                aria-pressed={selected}
                aria-current={isSameDay(day, today) ? 'date' : undefined}
                className={joinClasses(styles.day, {
                  [styles.selected]: selected,
                  [styles.today]: isSameDay(day, today)
                })}
                tabIndex={tabStop && isSameDay(day, tabStop) ? 0 : -1}
                disabled={isDisabled(day)}
                onKeyDown={(event) => keyDownHandler(event, day)}
                onClick={() => setValue(day)}
              >
                <span className={styles.weekday}>
                  {formats.weekday.format(day)}
                </span>
                <span className={styles.number}>{day.getDate()}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

MiniCalendarComponent.displayName = 'BolioUIMiniCalendar'
const MiniCalendar = withScale(MiniCalendarComponent) as ScaleComponent<
  HTMLDivElement,
  MiniCalendarProps
>
export default MiniCalendar
