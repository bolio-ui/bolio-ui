import { useCallback, useEffect, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseLocalStorageOptions<T> = {
  key: string
  defaultValue: T
}

const EVENT = 'bolio-ui-local-storage'

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

const useLocalStorage = <T>({
  key,
  defaultValue
}: UseLocalStorageOptions<T>): [
  T,
  (value: T | ((current: T) => T)) => void,
  () => void
] => {
  const [value, setState] = useState(defaultValue)
  const fallback = useLatest(defaultValue)
  const current = useLatest(value)

  useEffect(() => {
    const sync = (event: Event) => {
      const changed =
        (event as StorageEvent).key ?? (event as CustomEvent<string>).detail
      if (changed === null || changed === key) {
        setState(read(key, fallback.current))
      }
    }
    setState(read(key, fallback.current))
    window.addEventListener('storage', sync)
    window.addEventListener(EVENT, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(EVENT, sync)
    }
  }, [key, fallback])

  const setValue = useCallback(
    (next: T | ((current: T) => T)) => {
      const result =
        typeof next === 'function'
          ? (next as (current: T) => T)(current.current)
          : next
      try {
        window.localStorage.setItem(key, JSON.stringify(result))
      } catch {
        // storage is full or blocked, the state still updates
      }
      setState(result)
      window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
    },
    [key, current]
  )

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // storage is blocked
    }
    setState(fallback.current)
    window.dispatchEvent(new CustomEvent(EVENT, { detail: key }))
  }, [key, fallback])

  return [value, setValue, remove]
}

export default useLocalStorage
