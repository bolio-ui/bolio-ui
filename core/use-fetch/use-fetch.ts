import { useCallback, useEffect, useRef, useState } from 'react'

export type UseFetchOptions = RequestInit & {
  autoInvoke?: boolean
}

export type UseFetchResult<T> = {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<T | null>
  abort: () => void
}

const useFetch = <T = unknown>(
  url: string,
  { autoInvoke = true, ...init }: UseFetchOptions = {}
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(autoInvoke)
  const [error, setError] = useState<Error | null>(null)
  const controller = useRef<AbortController | null>(null)
  const initRef = useRef(init)
  initRef.current = init

  const refetch = useCallback(async () => {
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url, {
        signal: current.signal,
        ...initRef.current
      })
      if (!response.ok) throw new Error(`Request failed (${response.status})`)
      const json = (await response.json()) as T
      setData(json)
      setLoading(false)
      return json
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError(err as Error)
        setLoading(false)
      }
      return null
    }
  }, [url])

  const abort = useCallback(() => {
    controller.current?.abort()
    setLoading(false)
  }, [])

  useEffect(() => {
    if (autoInvoke) refetch()
    return () => controller.current?.abort()
  }, [autoInvoke, refetch])

  return { data, loading, error, refetch, abort }
}

export default useFetch
