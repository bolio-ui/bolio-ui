import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import styles from './SliderMark.module.css'

interface Props {
  max: number
  min: number
  step: number
}

export type MarkLeftValue = number

export type Marks = Array<MarkLeftValue>

const getMarks = (min: number, max: number, step: number): Marks => {
  const value = max - min
  const roundFunc = !(value % step) ? Math.floor : Math.ceil
  const count = roundFunc(value / step) - 1
  if (count >= 99) return []

  return [...new Array(count)].map(
    (_, index) => (step * (index + 1) * 100) / value
  )
}

function SliderMark({ step, max, min }: Props) {
  const theme = useTheme()
  const marks = useMemo(() => getMarks(min, max, step), [min, max, step])

  return (
    <>
      {marks.map((val, index) => (
        <span
          key={`${val}-${index}`}
          className={styles.span}
          style={{ left: `${val}%`, backgroundColor: theme.palette.background }}
        />
      ))}
    </>
  )
}

export default SliderMark
