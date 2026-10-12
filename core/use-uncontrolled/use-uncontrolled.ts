import { useState } from 'react'

export type UseUncontrolledOptions<T> = {
  value?: T
  defaultValue?: T
  finalValue?: T
  onChange?: (value: T) => void
}

const useUncontrolled = <T>({
  value,
  defaultValue,
  finalValue,
  onChange
}: UseUncontrolledOptions<T>): [T, (value: T) => void, boolean] => {
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue !== undefined ? defaultValue : finalValue
  )

  if (value !== undefined) {
    return [value, (next) => onChange?.(next), true]
  }
  return [
    uncontrolled as T,
    (next) => {
      setUncontrolled(next)
      onChange?.(next)
    },
    false
  ]
}

export default useUncontrolled
