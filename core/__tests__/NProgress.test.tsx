import React from 'react'
import { act, render, renderHook, screen } from '@testing-library/react'
import { BolioUIProvider, NProgress, useNProgress } from '..'

describe('<NProgress />', () => {
  it('is a progress bar with the value, named for assistive technology', () => {
    render(
      <BolioUIProvider>
        <NProgress value={42.4} />
      </BolioUIProvider>
    )
    const bar = screen.getByRole('progressbar', { name: 'Page loading' })
    expect(bar).toHaveAttribute('aria-valuenow', '42')
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('42.4%')
  })

  it('hides itself from the page and from readers when it is not visible', () => {
    render(
      <BolioUIProvider>
        <NProgress value={0} visible={false} />
      </BolioUIProvider>
    )
    const bar = screen.getByRole('progressbar', { hidden: true })
    expect(bar).toHaveAttribute('aria-hidden', 'true')
    expect(bar.style.opacity).toBe('0')
  })
})

describe('useNProgress', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('starts at a few percent and keeps moving, but never reaches the end', () => {
    const { result } = renderHook(() => useNProgress({ trickleSpeed: 100 }))
    expect(result.current.visible).toBe(false)
    act(() => result.current.start())
    expect(result.current.visible).toBe(true)
    expect(result.current.value).toBe(8)
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(result.current.value).toBeGreaterThan(8)
    act(() => {
      jest.advanceTimersByTime(100000)
    })
    expect(result.current.value).toBeLessThanOrEqual(94)
    expect(result.current.value).toBeGreaterThan(90)
  })

  it('finishes, fades out and goes back to zero', () => {
    const { result } = renderHook(() => useNProgress())
    act(() => result.current.start())
    act(() => result.current.complete())
    expect(result.current.value).toBe(100)
    expect(result.current.visible).toBe(true)
    act(() => {
      jest.advanceTimersByTime(250)
    })
    expect(result.current.visible).toBe(false)
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(result.current.value).toBe(0)
  })

  it('sets and steps the value by hand, within 0 and 100', () => {
    const { result } = renderHook(() => useNProgress())
    act(() => result.current.set(150))
    expect(result.current.value).toBe(100)
    act(() => result.current.set(-5))
    expect(result.current.value).toBe(0)
    act(() => result.current.increment())
    expect(result.current.value).toBe(10)
  })

  it('resets, and stops its timers when it unmounts', () => {
    const { result, unmount } = renderHook(() => useNProgress())
    act(() => result.current.start())
    act(() => result.current.reset())
    expect(result.current.value).toBe(0)
    expect(result.current.visible).toBe(false)
    act(() => result.current.start())
    unmount()
    expect(jest.getTimerCount()).toBe(0)
  })

  it('starts again from where it is when it is already loading', () => {
    const { result } = renderHook(() => useNProgress({ trickleSpeed: 100 }))
    act(() => result.current.start())
    act(() => {
      jest.advanceTimersByTime(500)
    })
    const before = result.current.value
    act(() => result.current.start())
    expect(result.current.value).toBe(before)
  })
})
