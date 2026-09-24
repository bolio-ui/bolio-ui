import seed from '../content/docs/seed.json'

export interface DocHit {
  title: string
  head?: string
  component: boolean
  path: string
}

const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const getTerms = (query: string) =>
  normalize(query).split(/\s+/).filter(Boolean)

const index = (seed as DocHit[]).map((hit) => ({
  hit,
  title: normalize(hit.title),
  head: normalize(hit.head || '')
}))

// Every term must appear in the title or in the parent component name.
// Lower score ranks first: title prefix, then title, then parent, with
// component pages ahead of their sections.
export const searchDocs = (query: string, limit: number): DocHit[] => {
  const terms = getTerms(query)
  if (!terms.length) return []

  const matches: Array<{ hit: DocHit; score: number }> = []
  for (const { hit, title, head } of index) {
    let score = hit.component ? 0 : 1
    const found = terms.every((term) => {
      if (title.startsWith(term)) return true
      if (title.includes(term)) return (score += 2), true
      if (head.includes(term)) return (score += 3), true
      return false
    })
    if (found) matches.push({ hit, score })
  }

  return matches
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ hit }) => hit)
}

export const splitMatches = (text: string, query: string) => {
  const source = normalize(text)
  if (source.length !== text.length) return [{ text, match: false }]

  const marked: boolean[] = new Array(text.length).fill(false)
  for (const term of getTerms(query)) {
    for (
      let from = source.indexOf(term);
      from !== -1;
      from = source.indexOf(term, from + term.length)
    ) {
      marked.fill(true, from, from + term.length)
    }
  }

  const parts: Array<{ text: string; match: boolean }> = []
  for (let i = 0; i < text.length; i++) {
    const last = parts[parts.length - 1]
    if (last && last.match === marked[i]) last.text += text[i]
    else parts.push({ text: text[i], match: marked[i] })
  }
  return parts
}
