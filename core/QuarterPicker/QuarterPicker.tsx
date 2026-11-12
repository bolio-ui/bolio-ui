import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import type { ScaleComponent } from '../use-scale/with-scale'
import useClasses, { joinClasses } from '../use-classes'
import styles from './QuarterPicker.module.css'

interface Props {
  value?: Date | null
  initialValue?: Date | null
  onChange?: (quarter: Date) => void
  min?: Date
  max?: Date
  autoFocus?: boolean
  previousLabel?: string
  nextLabel?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type QuarterPickerProps = Props & NativeAttrs

// A quarter as year * 4 + quarter, so moving between years is plain arithmetic.
const toIndex = (date: Date) =>
  date.getFullYear() * 4 + Math.floor(date.getMonth() / 3)
const fromIndex = (index: number) =>
  new Date(Math.floor(index / 4), (index % 4) * 3, 1)

const QuarterPickerComponent = React.forwardRef<
  HTMLDivElement,
  QuarterPickerProps
>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      min,
      max,
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

    // The focused quarter decides which year is shown.
    const [focused, setFocused] = useState(() =>
      clamp(toIndex(current || new Date()))
    )
    const year = Math.floor(focused / 4)

    const gridRef = useRef<HTMLDivElement>(null)
    // The DOM focus only follows the focused quarter after the keyboard or on mount.
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
        ArrowUp: index - 2,
        ArrowDown: index + 2,
        Home: year * 4,
        End: year * 4 + 3,
        PageUp: index - 4,
        PageDown: index + 4
      }
      if (!(event.key in targets)) return
      event.preventDefault()
      moveFocus.current = true
      setFocused(clamp(targets[event.key]))
    }

    const today = toIndex(new Date())
    const previousDisabled = minIndex !== undefined && year * 4 - 1 < minIndex
    const nextDisabled = maxIndex !== undefined && (year + 1) * 4 > maxIndex
    const goToYear = (step: number) => setFocused(clamp(focused + step * 4))

    const pickerStyle = {
      '--quarter-picker-font-size': SCALES.font(1),
      '--quarter-picker-text-color': theme.palette.foreground,
      '--quarter-picker-width': SCALES.width(1, 'auto'),
      '--quarter-picker-height': SCALES.height(1, 'auto'),
      '--quarter-picker-padding-top': SCALES.pt(0),
      '--quarter-picker-padding-right': SCALES.pr(0),
      '--quarter-picker-padding-bottom': SCALES.pb(0),
      '--quarter-picker-padding-left': SCALES.pl(0),
      '--quarter-picker-margin-top': SCALES.mt(0),
      '--quarter-picker-margin-right': SCALES.mr(0),
      '--quarter-picker-margin-bottom': SCALES.mb(0),
      '--quarter-picker-margin-left': SCALES.ml(0),
      '--quarter-picker-radius': theme.layout.radius,
      '--quarter-picker-hover-bg': `var(--calendar-popup-hover, ${theme.palette.accents_2})`,
      '--quarter-picker-focus-outline': theme.palette.primary,
      '--quarter-picker-disabled-color': theme.palette.accents_3,
      '--quarter-picker-today-border': theme.palette.accents_4,
      '--quarter-picker-selected-color': '#fff',
      '--quarter-picker-selected-bg': theme.palette.primary,
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
          {Array.from({ length: 4 }, (_, quarter) => {
            const index = year * 4 + quarter
            const selected = index === selectedIndex
            return (
              <button
                key={quarter}
                type="button"
                data-index={index}
                aria-label={`Q${quarter + 1} ${year}`}
                aria-pressed={selected}
                aria-current={index === today ? 'date' : undefined}
                className={joinClasses(styles.button, styles.quarterButton, {
                  [styles.selected]: selected,
                  [styles.today]: index === today
                })}
                tabIndex={index === focused ? 0 : -1}
                disabled={isDisabled(index)}
                onClick={() => select(index)}
                onKeyDown={(event) => keyDownHandler(event, index)}
              >
                Q{quarter + 1}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

QuarterPickerComponent.displayName = 'BolioUIQuarterPicker'
const QuarterPicker = withScale(QuarterPickerComponent) as ScaleComponent<
  HTMLDivElement,
  QuarterPickerProps
>
export default QuarterPicker
