export type FormRule<Value = unknown, Values = unknown> = (
  value: Value,
  values: Values,
  path: string
) => string | null | undefined

const isEmpty = (value: unknown) =>
  value === null ||
  value === undefined ||
  value === false ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (Array.isArray(value) && value.length === 0)

export const isNotEmpty =
  (message: string): FormRule =>
  (value) =>
    isEmpty(value) ? message : null

export const isEmail =
  (message: string): FormRule =>
  (value) =>
    typeof value === 'string' && /^\S+@\S+\.\S+$/.test(value.trim())
      ? null
      : message

export const matches =
  (pattern: RegExp, message: string): FormRule =>
  (value) =>
    typeof value === 'string' && pattern.test(value) ? null : message

export const hasLength =
  (
    length: number | { min?: number; max?: number },
    message: string
  ): FormRule =>
  (value) => {
    const size = (value as { length?: number } | null | undefined)?.length
    const trimmed = typeof value === 'string' ? value.trim().length : size
    if (typeof trimmed !== 'number') return message
    const { min, max } =
      typeof length === 'number' ? { min: length, max: length } : length
    if (min !== undefined && trimmed < min) return message
    if (max !== undefined && trimmed > max) return message
    return null
  }

export const isInRange =
  ({ min, max }: { min?: number; max?: number }, message: string): FormRule =>
  (value) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return message
    if (min !== undefined && value < min) return message
    if (max !== undefined && value > max) return message
    return null
  }

export const matchesField =
  (path: string, message: string): FormRule =>
  (value, values) =>
    value === getPath(values, path) ? null : message

export const getPath = (source: unknown, path: string): unknown =>
  path
    .split('.')
    .reduce<unknown>(
      (current, key) => (current as Record<string, unknown> | null)?.[key],
      source
    )
