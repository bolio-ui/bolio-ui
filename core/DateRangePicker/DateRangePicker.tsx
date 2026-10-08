import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import { getColors } from '../Input/styles'
import { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import useClickAway from '../utils/use-click-away'
import Calendar from '../Calendar'
import type { DateRange } from '../Calendar'
import { fromISO, startOfDay, toISO } from '../Calendar/date-utils'
import styles from './DateRangePicker.module.css'
import { getSurface } from '../utils/surface'

// the width of the popup in em, with the calendar of two months and of one
const TWO_MONTHS_EM = 46
const ONE_MONTH_EM = 22

interface Props {
  value?: DateRange
  initialValue?: DateRange
  // also called with only the start while the range is being picked
  onChange?: (range: DateRange) => void
  min?: Date
  max?: Date
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  startPlaceholder?: string
  endPlaceholder?: string
  startLabel?: string
  endLabel?: string
  calendarLabel?: string
  disabled?: boolean
  type?: NormalTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type DateRangePickerProps = Props & NativeAttrs

const emptyRange: DateRange = [null, null]
const format = (date: Date | null) => (date ? toISO(date) : '')

const DateRangePickerComponent = React.forwardRef<
  HTMLDivElement,
  DateRangePickerProps
>(
  (
    {
      value: customValue,
      initialValue = emptyRange,
      onChange,
      min,
      max,
      locale,
      weekStartsOn,
      startPlaceholder = 'YYYY-MM-DD',
      endPlaceholder = 'YYYY-MM-DD',
      startLabel = 'Start date',
      endLabel = 'End date',
      calendarLabel = 'Choose dates',
      disabled = false,
      type = 'default',
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const surface = getSurface(theme)
    const { SCALES } = useScale()
    const colors = getColors(theme.palette, type, disabled, {
      filled,
      light,
      ghost,
      subtle
    })

    const isControlled = customValue !== undefined
    const [selfValue, setSelfValue] = useState<DateRange>(initialValue)
    const range = isControlled ? customValue : selfValue
    const [start, end] = range
    const startText = format(start)
    const endText = format(end)

    const [texts, setTexts] = useState({ start: startText, end: endText })
    const [open, setOpen] = useState(false)
    // set when the popup opens, from the room there is to the right of the field
    const [fit, setFit] = useState({ months: 2, alignEnd: false })

    useEffect(() => {
      setTexts({ start: startText, end: endText })
    }, [startText, endText])

    const rootRef = useRef<HTMLDivElement>(null)
    const endRef = useRef<HTMLInputElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    useClickAway(rootRef, () => setOpen(false))

    const isInBounds = (date: Date) =>
      !((min && date < startOfDay(min)) || (max && date > startOfDay(max)))

    const commit = (next: DateRange) => {
      if (!isControlled) setSelfValue(next)
      if (onChange) onChange(next)
    }

    const inputHandler =
      (edge: 'start' | 'end') =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value
        setTexts((last) => ({ ...last, [edge]: next }))
        const other = edge === 'start' ? end : start
        if (next === '') {
          return commit(edge === 'start' ? [null, other] : [other, null])
        }
        const date = fromISO(next)
        if (!date || !isInBounds(date)) return
        // the end cannot come before the start
        if (other && (edge === 'start' ? date > other : date < other)) return
        commit(edge === 'start' ? [date, other] : [other, date])
      }

    const blurHandler = () => setTexts({ start: startText, end: endText })

    // Two months do not fit a small screen, or a field near the right edge, so
    // the calendar shows one month, and sits against the right side of the field
    // when even that is too wide.
    const toggle = () => {
      const root = rootRef.current
      if (!open && root) {
        const em = parseFloat(getComputedStyle(root).fontSize) || 16
        const room =
          document.documentElement.clientWidth -
          root.getBoundingClientRect().left
        setFit({
          months: room >= TWO_MONTHS_EM * em ? 2 : 1,
          alignEnd: room < ONE_MONTH_EM * em
        })
      }
      setOpen((last) => !last)
    }

    const pick = (next: DateRange) => {
      commit(next)
      if (!next[1]) return
      setOpen(false)
      endRef.current?.focus()
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
    }

    const rangeStyle = {
      '--daterange-font-size': SCALES.font(0.875),
      '--daterange-input-height': SCALES.height(2.25),
      '--daterange-width': SCALES.width(1, 'initial'),
      '--daterange-height': SCALES.height(1, 'auto'),
      '--daterange-padding-top': SCALES.pt(0),
      '--daterange-padding-right': SCALES.pr(0),
      '--daterange-padding-bottom': SCALES.pb(0),
      '--daterange-padding-left': SCALES.pl(0),
      '--daterange-margin-top': SCALES.mt(0),
      '--daterange-margin-right': SCALES.mr(0),
      '--daterange-margin-bottom': SCALES.mb(0),
      '--daterange-margin-left': SCALES.ml(0),
      '--daterange-bg': surface.bg,
      '--calendar-popup-hover': surface.hover,
      '--daterange-border-color': theme.palette.border,
      '--daterange-radius': rounded ? '25px' : theme.layout.radius,
      '--daterange-popup-radius': theme.layout.radius,
      '--daterange-field-color': colors.color,
      '--daterange-field-bg': colors.bgColor,
      '--daterange-field-border': colors.borderColor,
      '--daterange-field-hover-bg': colors.hoverBgColor,
      '--daterange-field-hover-border': colors.hoverBorder,
      '--daterange-focus-border-color': colors.focusBorder,
      '--daterange-placeholder-color': colors.placeholderColor,
      '--daterange-separator-color': colors.iconColor,
      '--daterange-toggle-color': colors.iconColor,
      '--daterange-toggle-hover-color': colors.color,
      '--daterange-shadow': surface.shadow,
      ...style
    } as React.CSSProperties

    const inputProps = {
      type: 'text',
      autoComplete: 'off',
      inputMode: 'numeric',
      disabled,
      onBlur: blurHandler,
      className: styles.input
    } as const

    return (
      <div
        ref={(node) => {
          rootRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        className={useClasses(styles.daterange, className)}
        style={rangeStyle}
        role="group"
        {...props}
      >
        <div className={styles.field}>
          <input
            {...inputProps}
            value={texts.start}
            placeholder={startPlaceholder}
            aria-label={startLabel}
            onChange={inputHandler('start')}
          />
          <span className={styles.separator} aria-hidden="true">
            –
          </span>
          <input
            {...inputProps}
            ref={endRef}
            value={texts.end}
            placeholder={endPlaceholder}
            aria-label={endLabel}
            onChange={inputHandler('end')}
          />
          <button
            ref={buttonRef}
            type="button"
            className={styles.toggle}
            aria-label={calendarLabel}
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            onClick={toggle}
          >
            <svg
              viewBox="0 0 24 24"
              width="1.25em"
              height="1.25em"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </button>
        </div>
        {open && (
          <div
            role="dialog"
            aria-label={calendarLabel}
            className={joinClasses(styles.popup, {
              [styles.alignEnd]: fit.alignEnd
            })}
            onKeyDown={keyDownHandler}
          >
            <Calendar
              mode="range"
              numberOfMonths={fit.months}
              autoFocus
              value={range}
              min={min}
              max={max}
              locale={locale}
              weekStartsOn={weekStartsOn}
              onChange={pick}
            />
          </div>
        )}
      </div>
    )
  }
)

DateRangePickerComponent.displayName = 'BolioUIDateRangePicker'
const DateRangePicker = withScale(DateRangePickerComponent)
export default DateRangePicker
