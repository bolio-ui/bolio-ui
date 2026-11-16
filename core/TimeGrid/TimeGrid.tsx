import React, { useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import type { ScaleComponent } from '../use-scale/with-scale'
import useClasses, { joinClasses } from '../use-classes'
import useUncontrolled from '../use-uncontrolled'
import styles from './TimeGrid.module.css'

interface Props {
  // "HH:mm" in 24 hours, whatever the format shown
  value?: string
  initialValue?: string
  // called with the time, or '' when allowDeselect clears it
  onChange?: (time: string) => void
  startTime?: string
  endTime?: string
  // minutes between two times
  interval?: number
  format?: '12h' | '24h'
  locale?: string
  disabledTimes?: string[]
  // a click on the chosen time clears it
  allowDeselect?: boolean
  label?: string
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'onChange' | 'defaultValue'
>
export type TimeGridProps = Props & NativeAttrs

const pad = (value: number) => String(value).padStart(2, '0')
const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + (minutes || 0)
}
const toTime = (minutes: number) =>
  `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

const TimeGridComponent = React.forwardRef<HTMLDivElement, TimeGridProps>(
  (
    {
      value: customValue,
      initialValue = '',
      onChange,
      startTime = '09:00',
      endTime = '18:00',
      interval = 30,
      format = '24h',
      locale,
      disabledTimes = [],
      allowDeselect = false,
      label = 'Time',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [value, setValue] = useUncontrolled<string>({
      value: customValue,
      defaultValue: initialValue,
      onChange
    })

    const times = useMemo(() => {
      const list: string[] = []
      for (
        let minutes = toMinutes(startTime);
        minutes <= toMinutes(endTime);
        minutes += Math.max(interval, 1)
      )
        list.push(toTime(minutes))
      return list
    }, [startTime, endTime, interval])

    const formatter = useMemo(
      () =>
        new Intl.DateTimeFormat(locale, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: format === '12h'
        }),
      [locale, format]
    )
    const text = (time: string) =>
      formatter.format(new Date(2000, 0, 1, 0, toMinutes(time)))

    const isDisabled = (time: string) => disabledTimes.includes(time)
    const enabled = times.filter((time) => !isDisabled(time))

    // One tab stop: the chosen time, or the first one that can be chosen.
    const [focused, setFocused] = useState('')
    const stop = [value, focused].find((time) => enabled.includes(time))
    const tabStop = stop || enabled[0]
    const buttons = useRef(new Map<string, HTMLButtonElement>())

    const keyDownHandler = (
      event: React.KeyboardEvent<HTMLButtonElement>,
      time: string
    ) => {
      const index = enabled.indexOf(time)
      const targets: Record<string, number> = {
        ArrowLeft: index - 1,
        ArrowUp: index - 1,
        ArrowRight: index + 1,
        ArrowDown: index + 1,
        Home: 0,
        End: enabled.length - 1
      }
      if (!(event.key in targets)) return
      event.preventDefault()
      const target =
        enabled[Math.min(Math.max(targets[event.key], 0), enabled.length - 1)]
      setFocused(target)
      buttons.current.get(target)?.focus()
    }

    const gridStyle = {
      '--time-grid-font-size': SCALES.font(0.875),
      '--time-grid-width': SCALES.width(1, 'auto'),
      '--time-grid-padding-top': SCALES.pt(0),
      '--time-grid-padding-right': SCALES.pr(0),
      '--time-grid-padding-bottom': SCALES.pb(0),
      '--time-grid-padding-left': SCALES.pl(0),
      '--time-grid-margin-top': SCALES.mt(0),
      '--time-grid-margin-right': SCALES.mr(0),
      '--time-grid-margin-bottom': SCALES.mb(0),
      '--time-grid-margin-left': SCALES.ml(0),
      '--time-grid-text-color': theme.palette.foreground,
      '--time-grid-radius': theme.layout.radius,
      '--time-grid-border': theme.palette.border,
      '--time-grid-hover-bg': theme.palette.accents_2,
      '--time-grid-focus-outline': theme.palette.primary,
      '--time-grid-disabled-color': theme.palette.accents_3,
      '--time-grid-selected-color': '#fff',
      '--time-grid-selected-bg': theme.palette.primary,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={label}
        className={useClasses(styles.grid, className)}
        style={gridStyle}
        {...props}
      >
        {times.map((time) => {
          const selected = time === value
          return (
            <button
              key={time}
              ref={(element) => {
                if (element) buttons.current.set(time, element)
                else buttons.current.delete(time)
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              className={joinClasses(styles.time, {
                [styles.selected]: selected
              })}
              tabIndex={time === tabStop ? 0 : -1}
              disabled={isDisabled(time)}
              onFocus={() => setFocused(time)}
              onKeyDown={(event) => keyDownHandler(event, time)}
              onClick={() =>
                setValue(selected ? (allowDeselect ? '' : time) : time)
              }
            >
              {text(time)}
            </button>
          )
        })}
      </div>
    )
  }
)

TimeGridComponent.displayName = 'BolioUITimeGrid'
const TimeGrid = withScale(TimeGridComponent) as ScaleComponent<
  HTMLDivElement,
  TimeGridProps
>
export default TimeGrid
