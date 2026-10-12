import React from 'react'
import { render } from '@testing-library/react'
import { BolioUIProvider, Mark } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

const marked = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('mark')).map((el) => el.textContent)

describe('<Mark />', () => {
  it('marks the term without regard to case', () => {
    const { container } = wrap(
      <Mark highlight="theme">The Theme of a theme</Mark>
    )
    expect(marked(container)).toEqual(['Theme', 'theme'])
    expect(container.textContent).toBe('The Theme of a theme')
  })

  it('marks several terms and prefers the longest match', () => {
    const { container } = wrap(
      <Mark highlight={['bolio', 'bolio ui']}>Bolio UI and bolio</Mark>
    )
    expect(marked(container)).toEqual(['Bolio UI', 'bolio'])
  })

  it('treats special characters as plain text', () => {
    const { container } = wrap(<Mark highlight="a.b(">axb and a.b(</Mark>)
    expect(marked(container)).toEqual(['a.b('])
  })

  it('renders the text alone without terms', () => {
    const { container } = wrap(<Mark highlight="">Plain text</Mark>)
    expect(marked(container)).toEqual([])
    expect(container.textContent).toBe('Plain text')
  })

  it('keeps the consumer style and passes native props', () => {
    const { container } = wrap(
      <Mark highlight="a" style={{ color: 'red' }} data-testid="m">
        a
      </Mark>
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.style.color).toBe('red')
    expect(root).toHaveAttribute('data-testid', 'm')
  })
})
