import { useState } from 'react'

export type UseQueueOptions<T> = {
  initialValues?: T[]
  limit?: number
}

export type UseQueueResult<T> = {
  state: T[]
  queue: T[]
  add: (...items: T[]) => void
  update: (fn: (items: T[]) => T[]) => void
  cleanQueue: () => void
}

const useQueue = <T>({
  initialValues = [],
  limit = Infinity
}: UseQueueOptions<T> = {}): UseQueueResult<T> => {
  const split = (items: T[]) => ({
    state: items.slice(0, limit),
    queue: items.slice(limit)
  })
  const [value, setValue] = useState(() => split(initialValues))

  return {
    state: value.state,
    queue: value.queue,
    add: (...items) =>
      setValue((current) =>
        split([...current.state, ...current.queue, ...items])
      ),
    update: (fn) =>
      setValue((current) => split(fn([...current.state, ...current.queue]))),
    cleanQueue: () =>
      setValue((current) => ({ state: current.state, queue: [] }))
  }
}

export default useQueue
