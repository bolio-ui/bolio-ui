import { searchDocs, splitMatches } from '../local-search'

describe('searchDocs', () => {
  it('returns nothing for an empty query', () => {
    expect(searchDocs('', 8)).toEqual([])
    expect(searchDocs('   ', 8)).toEqual([])
  })

  it('ranks the component page before its sections', () => {
    const hits = searchDocs('avatar', 8)
    expect(hits[0]).toMatchObject({ title: 'Avatar', component: true })
    expect(hits.some((hit) => hit.head === 'Avatar')).toBe(true)
  })

  it('matches by parent component name', () => {
    const hits = searchDocs('avatar apis', 8)
    expect(
      hits.some((hit) => hit.path === '/docs/components/avatar#apis')
    ).toBe(true)
  })

  it('finds guides, hooks and their sections', () => {
    expect(searchDocs('useClipboard', 8)[0]).toMatchObject({
      path: '/docs/hooks/use-clipboard'
    })
    expect(searchDocs('migrating', 8)[0]).toMatchObject({
      path: '/docs/guide/migration-v1-to-v2'
    })
    expect(
      searchDocs('breaking changes', 8).some(
        (hit) => hit.path === '/docs/guide/migration-v1-to-v2#breaking-changes'
      )
    ).toBe(true)
  })

  it('lists the General and APIs sections of a hook', () => {
    const paths = searchDocs('clipboard', 8).map((hit) => hit.path)
    expect(paths).toContain('/docs/hooks/use-clipboard#general')
    expect(paths).toContain('/docs/hooks/use-clipboard#apis')
  })

  it('ignores case and accents', () => {
    expect(searchDocs('AVATÁR', 8)).toEqual(searchDocs('avatar', 8))
  })

  it('respects the limit', () => {
    expect(searchDocs('a', 3)).toHaveLength(3)
  })

  it('returns nothing when a term does not match', () => {
    expect(searchDocs('zzzzzz', 8)).toEqual([])
  })
})

describe('splitMatches', () => {
  it('marks the matched parts', () => {
    expect(splitMatches('Avatar Group', 'grou')).toEqual([
      { text: 'Avatar ', match: false },
      { text: 'Grou', match: true },
      { text: 'p', match: false }
    ])
  })

  it('returns the whole text when there is no match', () => {
    expect(splitMatches('Avatar', 'xyz')).toEqual([
      { text: 'Avatar', match: false }
    ])
  })
})
