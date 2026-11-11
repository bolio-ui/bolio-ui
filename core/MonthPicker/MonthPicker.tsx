import React, { useEffect, useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import type { ScaleComponent } from '../use-scale/with-scale'
import useClasses, { joinClasses } from '../use-classes'
import styles from './MonthPicker.module.css'

interface Props {
  value?: Date | null
  initialValue?: Date | null
  onChange?: (month: Date) => void
  min?: Date
  max?: Date
  locale?: string
  autoFocus?: boolean
  previousLabel?: string
  nextLabel?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type MonthPickerProps = Props & NativeAttrs

// A month as year * 12 + month, so moving between years is plain arithmetic.
const toIndex = (date: Date) => date.getFullYear() * 12 + date.getMonth()
const fromIndex = (index: number) =>
  new Date(Math.floor(index / 12), index % 12, 1)

const MonthPickerComponent = React.forwardRef<HTMLDivElement, MonthPickerProps>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      min,
      max,
      locale = 'en-US',
      autoFocus = false,
      previousLabel = 'Previous year',
      nextLabel = 'Next year',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const minIndex = min ? toIndex(min) : undefined
    const maxIndex = max ? toIndex(max) : undefined
    const clamp = (index: number) => {
      if (minIndex !== undefined && index < minIndex) return minIndex
      if (maxIndex !== undefined && index > maxIndex) return maxIndex
      return index
    }

    const [selfValue, setSelfValue] = useState<Date | null>(initialValue)
    const current = customValue !== undefined ? customValue : selfValue
    const selectedIndex = current ? toIndex(current) : null

    // The focused month decides which year is shown.
    const [focused, setFocused] = useState(() =>
      clamp(toIndex(current || new Date()))
    )
    const year = Math.floor(focused / 12)

    const gridRef = useRef<HTMLDivElement>(null)
    // The DOM focus only follows the focused month after the keyboard or on mount.
    const moveFocus = useRef(autoFocus)

    useEffect(() => {
      if (selectedIndex !== null) setFocused(clamp(selectedIndex))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedIndex, minIndex, maxIndex])

    useEffect(() => {
      if (!moveFocus.current) return
      moveFocus.current = false
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-index="${focused}"]`)
        ?.focus()
    }, [focused])

    const formats = useMemo(
      () => ({
        short: new Intl.DateTimeFormat(locale, { month: 'short' }),
        long: new Intl.DateTimeFormat(locale, {
          month: 'long',
          year: 'numeric'
        })
      }),
      [locale]
    )

    const isDisabled = (index: number) =>
      (minIndex !== undefined && index < minIndex) ||
      (maxIndex !== undefined && index > maxIndex)

    const select = (index: number) => {
      if (isDisabled(index)) return
      setFocused(index)
      const next = fromIndex(index)
      if (customValue === undefined) setSelfValue(next)
      if (onChange) onChange(next)
    }

    const keyDownHandler = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      index: number
    ) => {
      const targets: Record<string, number> = {
        ArrowLeft: index - 1,
        ArrowRight: index + 1,
        ArrowUp: index - 3,
        ArrowDown: index + 3,
        Home: year * 12,
        End: year * 12 + 11,
        PageUp: index - 12,
        PageDown: index + 12
      }
      if (!(event.key in targets)) return
      event.preventDefault()
      moveFocus.current = true
      setFocused(clamp(targets[event.key]))
    }

    const today = toIndex(new Date())
    const previousDisabled = minIndex !== undefined && year * 12 - 1 < minIndex
    const nextDisabled = maxIndex !== undefined && (year + 1) * 12 > maxIndex
    const goToYear = (step: number) => setFocused(clamp(focused + step * 12))

    const pickerStyle = {
      '--month-picker-font-size': SCALES.font(1),
      '--month-picker-text-color': theme.palette.foreground,
      '--month-picker-width': SCALES.width(1, 'auto'),
      '--month-picker-height': SCALES.height(1, 'auto'),
      '--month-picker-padding-top': SCALES.pt(0),
      '--month-picker-padding-right': SCALES.pr(0),
      '--month-picker-padding-bottom': SCALES.pb(0),
      '--month-picker-padding-left': SCALES.pl(0),
      '--month-picker-margin-top': SCALES.mt(0),
      '--month-picker-margin-right': SCALES.mr(0),
      '--month-picker-margin-bottom': SCALES.mb(0),
      '--month-picker-margin-left': SCALES.ml(0),
      '--month-picker-radius': theme.layout.radius,
      '--month-picker-hover-bg': `var(--calendar-popup-hover, ${theme.palette.accents_2})`,
      '--month-picker-focus-outline': theme.palette.primary,
      '--month-picker-disabled-color': theme.palette.accents_3,
      '--month-picker-today-border': theme.palette.accents_4,
      '--month-picker-selected-color': '#fff',
      '--month-picker-selected-bg': theme.palette.primary,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.picker, className)}
        style={pickerStyle}
        {...props}
      >
        <div className={styles.header}>
          <button
            type="button"
            className={joinClasses(styles.button, styles.navButton)}
            aria-label={previousLabel}
            disabled={previousDisabled}
            onClick={() => goToYear(-1)}
          >
            ‹
          </button>
          <div className={styles.title} aria-live="polite">
            {year}
          </div>
          <button
            type="button"
            className={joinClasses(styles.button, styles.navButton)}
            aria-label={nextLabel}
            disabled={nextDisabled}
            onClick={() => goToYear(1)}
          >
            ›
          </button>
        </div>
        <div
          ref={gridRef}
          role="group"
          aria-label={String(year)}
          className={styles.grid}
        >
          {Array.from({ length: 12 }, (_, month) => {
            const index = year * 12 + month
            const date = fromIndex(index)
            const selected = index === selectedIndex
            return (
              <button
                key={month}
                type="button"
                data-index={index}
                aria-label={formats.long.format(date)}
                aria-pressed={selected}
                aria-current={index === today ? 'date' : undefined}
                className={joinClasses(styles.button, styles.monthButton, {
                  [styles.selected]: selected,
                  [styles.today]: index === today
                })}
                tabIndex={index === focused ? 0 : -1}
                disabled={isDisabled(index)}
                onClick={() => select(index)}
                onKeyDown={(event) => keyDownHandler(event, index)}
              >
                {formats.short.format(date)}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

MonthPickerComponent.displayName = 'BolioUIMonthPicker'
const MonthPicker = withScale(MonthPickerComponent) as ScaleComponent<
  HTMLDivElement,
  MonthPickerProps
>
export default MonthPicker
