import { useCallback, useEffect, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseLocalStorageOptions<T> = {
  key: string
  defaultValue: T
}

export type StorageKind = 'localStorage' | 'sessionStorage'

// Builds the hook for one kind of storage, so useLocalStorage and
// useSessionStorage share the code.
export const createStorageHook = (kind: StorageKind, event: string) => {
  const read = <T>(key: string, fallback: T): T => {
    try {
      const raw = window[kind].getItem(key)
      return raw === null ? fallback : (JSON.parse(raw) as T)
    } catch {
      return fallback
    }
  }

  return <T>({
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
      const sync = (e: Event) => {
        const changed =
          (e as StorageEvent).key ?? (e as CustomEvent<string>).detail
        if (changed === null || changed === key) {
          setState(read(key, fallback.current))
        }
      }
      setState(read(key, fallback.current))
      window.addEventListener('storage', sync)
      window.addEventListener(event, sync)
      return () => {
        window.removeEventListener('storage', sync)
        window.removeEventListener(event, sync)
      }
    }, [key, fallback])

    const setValue = useCallback(
      (next: T | ((current: T) => T)) => {
        const result =
          typeof next === 'function'
            ? (next as (current: T) => T)(current.current)
            : next
        try {
          window[kind].setItem(key, JSON.stringify(result))
        } catch {
          // storage is full or blocked, the state still updates
        }
        setState(result)
        window.dispatchEvent(new CustomEvent(event, { detail: key }))
      },
      [key, current]
    )

    const remove = useCallback(() => {
      try {
        window[kind].removeItem(key)
      } catch {
        // storage is blocked
      }
      setState(fallback.current)
      window.dispatchEvent(new CustomEvent(event, { detail: key }))
    }, [key, fallback])

    return [value, setValue, remove]
  }
}

const useLocalStorage = createStorageHook(
  'localStorage',
  'bolio-ui-local-storage'
)

export default useLocalStorage
