import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import type { ScaleComponent } from '../use-scale/with-scale'
import useClasses, { joinClasses } from '../use-classes'
import styles from './YearPicker.module.css'

interface Props {
  value?: Date | null
  initialValue?: Date | null
  onChange?: (year: Date) => void
  min?: Date
  max?: Date
  autoFocus?: boolean
  previousLabel?: string
  nextLabel?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type YearPickerProps = Props & NativeAttrs

// Years come in pages of twelve, three columns by four rows.
const PAGE = 12

const YearPickerComponent = React.forwardRef<HTMLDivElement, YearPickerProps>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      min,
      max,
      autoFocus = false,
      previousLabel = 'Previous years',
      nextLabel = 'Next years',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const minYear = min ? min.getFullYear() : undefined
    const maxYear = max ? max.getFullYear() : undefined
    const clamp = (year: number) => {
      if (minYear !== undefined && year < minYear) return minYear
      if (maxYear !== undefined && year > maxYear) return maxYear
      return year
    }

    const [selfValue, setSelfValue] = useState<Date | null>(initialValue)
    const current = customValue !== undefined ? customValue : selfValue
    const selectedYear = current ? current.getFullYear() : null

    // The focused year decides which page is shown.
    const [focused, setFocused] = useState(() =>
      clamp((current || new Date()).getFullYear())
    )
    const start = Math.floor(focused / PAGE) * PAGE

    const gridRef = useRef<HTMLDivElement>(null)
    // The DOM focus only follows the focused year after the keyboard or on mount.
    const moveFocus = useRef(autoFocus)

    useEffect(() => {
      if (selectedYear !== null) setFocused(clamp(selectedYear))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedYear, minYear, maxYear])

    useEffect(() => {
      if (!moveFocus.current) return
      moveFocus.current = false
      gridRef.current
        ?.querySelector<HTMLButtonElement>(`[data-year="${focused}"]`)
        ?.focus()
    }, [focused])

    const isDisabled = (year: number) =>
      (minYear !== undefined && year < minYear) ||
      (maxYear !== undefined && year > maxYear)

    const select = (year: number) => {
      if (isDisabled(year)) return
      setFocused(year)
      const next = new Date(year, 0, 1)
      if (customValue === undefined) setSelfValue(next)
      if (onChange) onChange(next)
    }

    const keyDownHandler = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      year: number
    ) => {
      const targets: Record<string, number> = {
        ArrowLeft: year - 1,
        ArrowRight: year + 1,
        ArrowUp: year - 3,
        ArrowDown: year + 3,
        Home: start,
        End: start + PAGE - 1,
        PageUp: year - PAGE,
        PageDown: year + PAGE
      }
      if (!(event.key in targets)) return
      event.preventDefault()
      moveFocus.current = true
      setFocused(clamp(targets[event.key]))
    }

    const thisYear = new Date().getFullYear()
    const previousDisabled = minYear !== undefined && start - 1 < minYear
    const nextDisabled = maxYear !== undefined && start + PAGE > maxYear
    const goToPage = (step: number) => setFocused(clamp(focused + step * PAGE))

    const pickerStyle = {
      '--year-picker-font-size': SCALES.font(1),
      '--year-picker-text-color': theme.palette.foreground,
      '--year-picker-width': SCALES.width(1, 'auto'),
      '--year-picker-height': SCALES.height(1, 'auto'),
      '--year-picker-padding-top': SCALES.pt(0),
      '--year-picker-padding-right': SCALES.pr(0),
      '--year-picker-padding-bottom': SCALES.pb(0),
      '--year-picker-padding-left': SCALES.pl(0),
      '--year-picker-margin-top': SCALES.mt(0),
      '--year-picker-margin-right': SCALES.mr(0),
      '--year-picker-margin-bottom': SCALES.mb(0),
      '--year-picker-margin-left': SCALES.ml(0),
      '--year-picker-radius': theme.layout.radius,
      '--year-picker-hover-bg': `var(--calendar-popup-hover, ${theme.palette.accents_2})`,
      '--year-picker-focus-outline': theme.palette.primary,
      '--year-picker-disabled-color': theme.palette.accents_3,
      '--year-picker-today-border': theme.palette.accents_4,
      '--year-picker-selected-color': '#fff',
      '--year-picker-selected-bg': theme.palette.primary,
      ...style
    } as React.CSSProperties

    const range = `${start} – ${start + PAGE - 1}`

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
            onClick={() => goToPage(-1)}
          >
            ‹
          </button>
          <div className={styles.title} aria-live="polite">
            {range}
          </div>
          <button
            type="button"
            className={joinClasses(styles.button, styles.navButton)}
            aria-label={nextLabel}
            disabled={nextDisabled}
            onClick={() => goToPage(1)}
          >
            ›
          </button>
        </div>
        <div
          ref={gridRef}
          role="group"
          aria-label={range}
          className={styles.grid}
        >
          {Array.from({ length: PAGE }, (_, offset) => {
            const year = start + offset
            const selected = year === selectedYear
            return (
              <button
                key={year}
                type="button"
                data-year={year}
                aria-pressed={selected}
                aria-current={year === thisYear ? 'date' : undefined}
                className={joinClasses(styles.button, styles.yearButton, {
                  [styles.selected]: selected,
                  [styles.today]: year === thisYear
                })}
                tabIndex={year === focused ? 0 : -1}
                disabled={isDisabled(year)}
                onClick={() => select(year)}
                onKeyDown={(event) => keyDownHandler(event, year)}
              >
                {year}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

YearPickerComponent.displayName = 'BolioUIYearPicker'
const YearPicker = withScale(YearPickerComponent) as ScaleComponent<
  HTMLDivElement,
  YearPickerProps
>
export default YearPicker
