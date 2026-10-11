import { ChangeEvent, useCallback, useState } from 'react'

export type UseMaskOptions = {
  mask: string
  initialValue?: string
}

// # is a digit, A is a letter, * is a letter or a digit, anything else is literal
const TOKENS: Record<string, RegExp> = {
  '#': /\d/,
  A: /[a-zA-Z]/,
  '*': /[a-zA-Z0-9]/
}

export const applyMask = (value: string, mask: string) => {
  let result = ''
  let index = 0
  for (const token of mask) {
    if (index >= value.length) break
    const pattern = TOKENS[token]
    if (!pattern) {
      result += token
      if (value[index] === token) index += 1
      continue
    }
    while (index < value.length && !pattern.test(value[index])) index += 1
    if (index < value.length) result += value[index++]
  }
  return result
}

const useMask = ({
  mask,
  initialValue = ''
}: UseMaskOptions): [
  string,
  (value: string | ChangeEvent<HTMLInputElement>) => void
] => {
  const [value, setValue] = useState(() => applyMask(initialValue, mask))

  const onChange = useCallback(
    (next: string | ChangeEvent<HTMLInputElement>) =>
      setValue(
        applyMask(typeof next === 'string' ? next : next.target.value, mask)
      ),
    [mask]
  )

  return [value, onChange]
}

export default useMask
