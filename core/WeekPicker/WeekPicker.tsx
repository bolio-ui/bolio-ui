import React from 'react'
import Calendar from '../Calendar'
import type { CalendarProps } from '../Calendar'
import { addDays } from '../Calendar/date-utils'
import useUncontrolled from '../use-uncontrolled'

export type Week = [Date, Date]

type CalendarOptions = Omit<
  Extract<CalendarProps, { mode: 'range' }>,
  'mode' | 'value' | 'onChange' | 'maxSelected'
>

interface Props {
  // first and last day of the week
  value?: Week | null
  initialValue?: Week | null
  onChange?: (week: Week) => void
}

export type WeekPickerProps = Props & CalendarOptions

const WeekPicker = React.forwardRef<HTMLDivElement, WeekPickerProps>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      weekStartsOn = 0,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = useUncontrolled<Week | null>({
      value: customValue,
      defaultValue: initialValue,
      onChange: (week) => week && onChange?.(week)
    })

    // Any day that is clicked picks the whole week around it.
    const pick = ([date]: [Date | null, Date | null]) => {
      if (!date) return
      const start = addDays(date, -((date.getDay() - weekStartsOn + 7) % 7))
      setValue([start, addDays(start, 6)])
    }

    return (
      <Calendar
        {...props}
        ref={ref}
        mode="range"
        weekStartsOn={weekStartsOn}
        value={value || [null, null]}
        onChange={pick}
      />
    )
  }
)

WeekPicker.displayName = 'BolioUIWeekPicker'
export default WeekPicker
