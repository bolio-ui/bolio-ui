import React, { useState } from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useUncontrolled from '../use-uncontrolled'
import DatePicker from '../DatePicker'
import TimePicker from '../TimePicker'
import type { NormalTypes } from '../utils/prop-types'
import styles from './DateTimePicker.module.css'

interface Props {
  value?: Date | null
  initialValue?: Date | null
  onChange?: (date: Date | null) => void
  min?: Date
  max?: Date
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  withSeconds?: boolean
  format?: '12h' | '24h'
  datePlaceholder?: string
  dateLabel?: string
  timeLabel?: string
  disabled?: boolean
  type?: NormalTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'onChange' | 'defaultValue'
>
export type DateTimePickerProps = Props & NativeAttrs

const pad = (value: number) => String(value).padStart(2, '0')

const toTime = (date: Date, withSeconds: boolean) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}${
    withSeconds ? `:${pad(date.getSeconds())}` : ''
  }`

// The day of `date` at the "HH:mm[:ss]" time.
const join = (date: Date, time: string) => {
  const [hours, minutes, seconds] = time.split(':').map(Number)
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours || 0,
    minutes || 0,
    seconds || 0
  )
}

const DateTimePickerComponent = React.forwardRef<
  HTMLDivElement,
  DateTimePickerProps
>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      min,
      max,
      locale,
      weekStartsOn,
      withSeconds = false,
      format = '24h',
      datePlaceholder,
      dateLabel = 'Date',
      timeLabel = 'Time',
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
    const { SCALES } = useScale()
    const [value, setValue] = useUncontrolled<Date | null>({
      value: customValue,
      defaultValue: initialValue,
      onChange
    })
    // a time typed before any date is chosen waits here
    const [pending, setPending] = useState('')
    const time = value ? toTime(value, withSeconds) : pending

    const dateHandler = (date: Date | null) => {
      if (!date) return setValue(null)
      setValue(join(date, time || '00:00'))
    }

    const timeHandler = (next: string) => {
      setPending(next)
      if (value && next) setValue(join(value, next))
    }

    const shared = { disabled, type, rounded, filled, light, ghost, subtle }
    return (
      <div
        ref={ref}
        role="group"
        className={useClasses(styles.root, className)}
        style={{
          width: SCALES.width(1, 'auto'),
          margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
          ...style
        }}
        {...props}
      >
        <DatePicker
          {...shared}
          aria-label={dateLabel}
          value={value}
          onChange={dateHandler}
          min={min}
          max={max}
          locale={locale}
          weekStartsOn={weekStartsOn}
          placeholder={datePlaceholder}
        />
        <TimePicker
          {...shared}
          aria-label={timeLabel}
          value={time}
          onChange={timeHandler}
          withSeconds={withSeconds}
          format={format}
        />
      </div>
    )
  }
)

DateTimePickerComponent.displayName = 'BolioUIDateTimePicker'
const DateTimePicker = withScale(DateTimePickerComponent)
export default DateTimePicker
