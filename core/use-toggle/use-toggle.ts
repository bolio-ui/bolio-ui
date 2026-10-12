import { useCallback, useState } from 'react'
import useLatest from '../utils/use-latest'

const useToggle = <T = boolean>(
  options: readonly T[] = [false as T, true as T]
) => {
  const [index, setIndex] = useState(0)
  const optionsRef = useLatest(options)

  const toggle = useCallback(
    (value?: T) => {
      setIndex((current) => {
        if (value === undefined)
          return (current + 1) % optionsRef.current.length
        const next = optionsRef.current.indexOf(value)
        return next === -1 ? current : next
      })
    },
    [optionsRef]
  )

  return [options[index], toggle] as const
}

export default useToggle
