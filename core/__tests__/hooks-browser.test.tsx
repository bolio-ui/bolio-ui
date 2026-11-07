import React from 'react'
import { act, render, renderHook, waitFor } from '@testing-library/react'
import { useCollapse, useFetch, useHeadroom, useScrollIntoView } from 'core'

const response = (body: unknown, ok = true, status = 200) =>
  Promise.resolve({ ok, status, json: () => Promise.resolve(body) })

describe('useFetch', () => {
  const original = global.fetch
  afterEach(() => {
    global.fetch = original
  })

  it('loads the data when it mounts', async () => {
    global.fetch = jest.fn(() => response({ a: 1 })) as unknown as typeof fetch
    const { result } = renderHook(() => useFetch<{ a: number }>('/x'))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.data).toEqual({ a: 1 })
    expect(result.current.error).toBeNull()
  })

  it('reports a response that is not ok as an error', async () => {
    global.fetch = jest.fn(() =>
      response(null, false, 500)
    ) as unknown as typeof fetch
    const { result } = renderHook(() => useFetch('/x'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error?.message).toBe('Request failed (500)')
    expect(result.current.data).toBeNull()
  })

  it('waits for refetch when autoInvoke is off', async () => {
    const fetchMock = jest.fn(() => response([1]))
    global.fetch = fetchMock as unknown as typeof fetch
    const { result } = renderHook(() =>
      useFetch<number[]>('/x', { autoInvoke: false })
    )
    expect(result.current.loading).toBe(false)
    expect(fetchMock).not.toHaveBeenCalled()
    let returned: number[] | null = null
    await act(async () => {
      returned = await result.current.refetch()
    })
    expect(returned).toEqual([1])
    expect(result.current.data).toEqual([1])
  })

  it('sends the request options and ignores an aborted request', async () => {
    const fetchMock = jest.fn(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () =>
            reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))
          )
        })
    )
    global.fetch = fetchMock as unknown as typeof fetch
    const { result } = renderHook(() =>
      useFetch('/x', { method: 'POST', headers: { a: 'b' } })
    )
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      headers: { a: 'b' }
    })
    act(() => result.current.abort())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
  })
})

describe('useCollapse', () => {
  const Collapse = ({ opened }: { opened: boolean }) => {
    const { ref, style, onTransitionEnd } = useCollapse<HTMLDivElement>({
      opened
    })
    return (
      <div
        ref={ref}
        style={style}
        onTransitionEnd={onTransitionEnd}
        data-testid="box"
      />
    )
  }

  beforeEach(() => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 1
    })
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    jest
      .spyOn(HTMLElement.prototype, 'scrollHeight', 'get')
      .mockReturnValue(120)
  })
  afterEach(() => jest.restoreAllMocks())

  it('starts closed or open', () => {
    expect(
      renderHook(() => useCollapse({ opened: false })).result.current.style
    ).toEqual({ height: 0, overflow: 'hidden' })
    expect(
      renderHook(() => useCollapse({ opened: true })).result.current.style
    ).toEqual({})
  })

  it('animates to the content height, and drops the height at the end', () => {
    const { getByTestId, rerender } = render(<Collapse opened={false} />)
    rerender(<Collapse opened />)
    const box = getByTestId('box')
    expect(box.style.height).toBe('120px')
    expect(box.style.transition).toBe('height 200ms ease')
    act(() => {
      box.dispatchEvent(new Event('transitionend', { bubbles: true }))
    })
    expect(box.style.height).toBe('')
  })

  it('animates back to zero when it closes', () => {
    const { getByTestId, rerender } = render(<Collapse opened />)
    rerender(<Collapse opened={false} />)
    expect(getByTestId('box').style.height).toBe('0px')
  })
})

describe('useScrollIntoView', () => {
  let frames: FrameRequestCallback[] = []
  const flush = (now: number) => {
    const pending = frames
    frames = []
    pending.forEach((cb) => cb(now))
  }
  const target = (top: number) => {
    const element = document.createElement('div')
    element.getBoundingClientRect = () => ({ top }) as DOMRect
    return element
  }

  beforeEach(() => {
    frames = []
    jest.spyOn(performance, 'now').mockReturnValue(0)
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frames.push(cb)
      return frames.length
    })
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
    window.scrollTo = jest.fn()
  })
  afterEach(() => jest.restoreAllMocks())

  it('scrolls the window to the target, minus the offset', () => {
    const { result } = renderHook(() =>
      useScrollIntoView({ duration: 100, offset: 20 })
    )
    result.current.targetRef.current = target(500)
    act(() => result.current.scrollIntoView())
    flush(100)
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 480 })
  })

  it('scrolls its own container when there is one', () => {
    const { result } = renderHook(() => useScrollIntoView({ duration: 100 }))
    const container = target(100)
    result.current.scrollableRef.current = container
    result.current.targetRef.current = target(500)
    act(() => result.current.scrollIntoView())
    flush(100)
    expect(container.scrollTop).toBe(400)
  })

  it('does nothing without a target, and can be cancelled', () => {
    const { result, unmount } = renderHook(() => useScrollIntoView())
    act(() => result.current.scrollIntoView())
    expect(frames).toHaveLength(0)
    result.current.targetRef.current = target(10)
    act(() => result.current.scrollIntoView())
    act(() => result.current.cancel())
    expect(window.cancelAnimationFrame).toHaveBeenCalled()
    unmount()
  })
})

describe('useHeadroom', () => {
  const scrollTo = (y: number) =>
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })

  afterEach(() => scrollTo(0))

  it('hides when scrolling down and shows when scrolling up', () => {
    const onPin = jest.fn()
    const onFix = jest.fn()
    const onRelease = jest.fn()
    const { result } = renderHook(() =>
      useHeadroom({ fixedAt: 10, onPin, onFix, onRelease })
    )
    expect(result.current).toBe(true)
    scrollTo(200)
    expect(result.current).toBe(false)
    expect(onRelease).toHaveBeenCalledTimes(1)
    scrollTo(150)
    expect(result.current).toBe(true)
    expect(onPin).toHaveBeenCalledTimes(1)
    scrollTo(5)
    expect(result.current).toBe(true)
    expect(onFix).toHaveBeenCalledTimes(1)
  })

  it('works without callbacks and stops listening on unmount', () => {
    const { result, unmount } = renderHook(() => useHeadroom())
    scrollTo(300)
    expect(result.current).toBe(false)
    unmount()
    scrollTo(100)
  })
})
