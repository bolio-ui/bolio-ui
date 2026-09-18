export const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const addDays = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount)

// Keeps the day inside the target month, so January 31 plus one month is February 28.
export const addMonths = (date: Date, amount: number) => {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1)
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0
  ).getDate()
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), lastDay)
  )
}

export const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export const clampDate = (date: Date, min?: Date, max?: Date) => {
  if (min && date < min) return min
  if (max && date > max) return max
  return date
}

const pad = (value: number) => String(value).padStart(2, '0')

export const toISO = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

// Only real dates: 2026-02-31 is not accepted.
export const fromISO = (text: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim())
  if (!match) return null
  const [year, month, day] = [+match[1], +match[2], +match[3]]
  const date = new Date(year, month - 1, day)
  const isReal =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  return isReal ? date : null
}
