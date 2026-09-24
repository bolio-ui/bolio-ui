import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { getActiveIndex, useScrollSpy } from '../use-scroll-spy'

describe('getActiveIndex', () => {
  it('selects the last heading that reached the top', () => {
    const targets = [100, 600, 1100]
    expect(getActiveIndex(targets, 0, 5000)).toBe(-1)
    expect(getActiveIndex(targets, 100, 5000)).toBe(0)
    expect(getActiveIndex(targets, 700, 5000)).toBe(1)
    expect(getActiveIndex(targets, 1100, 5000)).toBe(2)
  })

  it('shares the scroll that is left among the headings the page can not reach', () => {
    // the page stops at 1000: headings at 1200, 1400 and 1600 never get to the top
    const targets = [100, 400, 1200, 1400, 1600]
    const max = 1000
    // the rest of the scroll, 400 to 1000, is split in three steps of 200
    expect(getActiveIndex(targets, 500, max)).toBe(1)
    expect(getActiveIndex(targets, 600, max)).toBe(2)
    expect(getActiveIndex(targets, 800, max)).toBe(3)
    expect(getActiveIndex(targets, 1000, max)).toBe(4)
  })

  it('selects the last heading at the end of the page, whatever its height', () => {
    const targets = [100, 900, 950, 990]
    for (const max of [300, 700, 950, 2000]) {
      expect(getActiveIndex(targets, max, max)).toBe(3)
    }
  })

  it('selects the first heading of a page that does not scroll', () => {
    expect(getActiveIndex([100, 200], 0, 0)).toBe(0)
    expect(getActiveIndex([], 0, 1000)).toBe(-1)
  })
})

const Spy = () => {
  const activeId = useScrollSpy(['first', 'last'])
  return (
    <>
      <a href="#first">first link</a>
      <span data-testid="active">{activeId}</span>
    </>
  )
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
    jest.runAllTimers()
  })
}

describe('useScrollSpy', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => window.setTimeout(callback, 0))
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.useRealTimers()
  })

  it('selects the last heading at the end of the page and keeps a clicked one', () => {
    const { getByTestId, getByText } = render(
      <>
        <h3 id="first" />
        <h3 id="last" />
        <Spy />
      </>
    )
    // jsdom has no layout: both headings are at the top of the page
    setPage(1200, 2000)
    expect(getByTestId('active').textContent).toBe('last')

    act(() => {
      fireEvent.click(getByText('first link'))
      jest.runAllTimers()
    })
    setPage(1200, 2000)
    expect(getByTestId('active').textContent).toBe('first')

    act(() => {
      window.dispatchEvent(new Event('wheel'))
      jest.runAllTimers()
    })
    expect(getByTestId('active').textContent).toBe('last')
  })
})
