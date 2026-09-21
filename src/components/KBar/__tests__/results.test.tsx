import React from 'react'
import { render, screen } from '@testing-library/react'
import { Action, KBarProvider, useKBar } from 'kbar'
import KBarResults from '../results'

// kbar 0.1.0-beta.6 types its components without `children`
const Provider = KBarProvider as React.FC<
  React.PropsWithChildren<React.ComponentProps<typeof KBarProvider>>
>

const actions: Action[] = [
  {
    id: 'docs',
    name: 'Documentation',
    keywords: 'docs',
    shortcut: [],
    children: ['hooks']
  },
  {
    id: 'hooks',
    name: 'Hooks',
    parent: 'docs',
    shortcut: [],
    keywords: 'hooks, clipboard',
    children: ['clip']
  },
  {
    id: 'clip',
    name: 'useClipboard',
    parent: 'hooks',
    keywords: 'clipboard',
    shortcut: [],
    perform: () => null
  }
]

const Search = ({ term }: { term: string }) => {
  const { query } = useKBar()
  React.useEffect(() => query.setSearch(term), [query, term])
  return null
}

const setup = (term: string) =>
  render(
    <Provider actions={actions}>
      <Search term={term} />
      <KBarResults onRender={(action) => <li>{action.name}</li>} />
    </Provider>
  )

describe('KBarResults', () => {
  it('lists only the top level actions without a term', () => {
    setup('')
    expect(screen.getByText('Documentation')).toBeTruthy()
    expect(screen.queryByText('Hooks')).toBeNull()
  })

  it('finds a nested group by its name with a term', () => {
    setup('hooks')
    expect(screen.getByText('Hooks')).toBeTruthy()
  })

  it('finds a nested group by its keywords with a term', () => {
    setup('clipboard')
    expect(screen.getByText('Hooks')).toBeTruthy()
  })
})
