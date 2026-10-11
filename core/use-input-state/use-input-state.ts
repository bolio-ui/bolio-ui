import { ChangeEvent, useCallback, useState } from 'react'

type InputChange<T> = T | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

const isEvent = (value: unknown): value is ChangeEvent<HTMLInputElement> =>
  typeof value === 'object' &&
  value !== null &&
  'currentTarget' in value &&
  'nativeEvent' in value

const useInputState = <T>(
  initialValue: T
): [T, (value: InputChange<T>) => void] => {
  const [value, setValue] = useState(initialValue)

  const onChange = useCallback((next: InputChange<T>) => {
    if (isEvent(next)) {
      const { currentTarget } = next
      setValue(
        (currentTarget.type === 'checkbox'
          ? currentTarget.checked
          : currentTarget.value) as T
      )
    } else {
      setValue(next as T)
    }
  }, [])

  return [value, onChange]
}

export default useInputState
