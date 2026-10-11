import { useState } from 'react'

export type UseValidatedStateValue<T> = {
  value: T
  lastValidValue: T | undefined
  valid: boolean
}

const useValidatedState = <T>(
  initialValue: T,
  validate: (value: T) => boolean
): [UseValidatedStateValue<T>, (value: T) => void] => {
  const [state, setState] = useState<UseValidatedStateValue<T>>(() => {
    const valid = validate(initialValue)
    return {
      value: initialValue,
      lastValidValue: valid ? initialValue : undefined,
      valid
    }
  })

  const onChange = (value: T) => {
    const valid = validate(value)
    setState((current) => ({
      value,
      lastValidValue: valid ? value : current.lastValidValue,
      valid
    }))
  }

  return [state, onChange]
}

export default useValidatedState
