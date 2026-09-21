import React from 'react'
import { act, render } from '@testing-library/react'
import { useScrollSpy } from '../use-scroll-spy'

const Spy = () => {
  const activeId = useScrollSpy(['#first', '#last'])
  return <span data-testid="active">{activeId}</span>
}

const setPage = (scrollY: number, scrollHeight: number) => {
  Object.defineProperty(window, 'innerHeight', {
    value: 800,
    configurable: true
  })
  Object.defineProperty(window, 'scrollY', {
    value: scrollY,
    configurable: true
  })
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true
  })
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('useScrollSpy', () => {
  beforeEach(() => {
    window.IntersectionObserver = class {
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver
  })

  it('selects the last heading at the end of the page', () => {
    const { getByTestId } = render(
      <>
        <h3 id="first" />
        <h3 id="last" />
        <Spy />
      </>
    )
    setPage(100, 2000)
    expect(getByTestId('active').textContent).toBe('')
    setPage(1200, 2000)
    expect(getByTestId('active').textContent).toBe('last')
  })
})
