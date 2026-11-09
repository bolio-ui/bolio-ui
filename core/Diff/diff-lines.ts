export type DiffKind = 'equal' | 'add' | 'remove'

export interface DiffLine {
  kind: DiffKind
  text: string
  // line numbers in the previous and in the current text
  oldNo?: number
  newNo?: number
}

// Longest common subsequence of two lists of lines, then the edit script
// that follows it. Plain dynamic programming: the texts a diff is shown for
// are small, and a line count product past `LIMIT` falls back to "all
// replaced" instead of freezing the page.
const LIMIT = 4_000_000

export const diffLines = (before: string, after: string): DiffLine[] => {
  const a = before === '' ? [] : before.split('\n')
  const b = after === '' ? [] : after.split('\n')
  const out: DiffLine[] = []

  if (a.length * b.length > LIMIT) {
    a.forEach((text, i) => out.push({ kind: 'remove', text, oldNo: i + 1 }))
    b.forEach((text, i) => out.push({ kind: 'add', text, newNo: i + 1 }))
    return out
  }

  const width = b.length + 1
  const table = new Uint32Array((a.length + 1) * width)
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      table[i * width + j] =
        a[i] === b[j]
          ? table[(i + 1) * width + j + 1] + 1
          : Math.max(table[(i + 1) * width + j], table[i * width + j + 1])

  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      out.push({ kind: 'equal', text: a[i], oldNo: i + 1, newNo: j + 1 })
      i++
      j++
    } else if (
      j >= b.length ||
      (i < a.length && table[(i + 1) * width + j] >= table[i * width + j + 1])
    ) {
      out.push({ kind: 'remove', text: a[i], oldNo: i + 1 })
      i++
    } else {
      out.push({ kind: 'add', text: b[j], newNo: j + 1 })
      j++
    }
  }
  return out
}

export type DiffMethod = 'words' | 'chars' | 'lines'

export interface Segment {
  text: string
  changed: boolean
}

const tokenize = (text: string, method: DiffMethod) =>
  method === 'chars' ? Array.from(text) : text.match(/\s+|\w+|[^\w\s]/g) || []

// Which parts of two paired lines changed, for the highlight inside a line
export const diffInline = (
  before: string,
  after: string,
  method: DiffMethod
): [Segment[], Segment[]] => {
  if (method === 'lines')
    return [
      [{ text: before, changed: false }],
      [{ text: after, changed: false }]
    ]
  const a = tokenize(before, method)
  const b = tokenize(after, method)
  const width = b.length + 1
  const table = new Uint32Array((a.length + 1) * width)
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      table[i * width + j] =
        a[i] === b[j]
          ? table[(i + 1) * width + j + 1] + 1
          : Math.max(table[(i + 1) * width + j], table[i * width + j + 1])

  const left: Segment[] = []
  const right: Segment[] = []
  const push = (list: Segment[], text: string, changed: boolean) => {
    const last = list[list.length - 1]
    if (last && last.changed === changed) last.text += text
    else list.push({ text, changed })
  }
  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      push(left, a[i], false)
      push(right, b[j], false)
      i++
      j++
    } else if (
      j >= b.length ||
      (i < a.length && table[(i + 1) * width + j] >= table[i * width + j + 1])
    ) {
      push(left, a[i], true)
      i++
    } else {
      push(right, b[j], true)
      j++
    }
  }
  return [left, right]
}
