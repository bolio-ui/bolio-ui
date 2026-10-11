import { act, renderHook } from '@testing-library/react'
import {
  useCounter,
  useDebouncedValue,
  useDidUpdate,
  useListState,
  useLocalStorage,
  useQueue,
  useStateHistory,
  useThrottledCallback,
  useToggle,
  useUncontrolled
} from 'core'

describe('hooks', () => {
  afterEach(() => {
    jest.useRealTimers()
    window.localStorage.clear()
  })

  it('useToggle flips a boolean and cycles through the options', () => {
    const { result } = renderHook(() => useToggle())
    act(() => result.current[1]())
    expect(result.current[0]).toBe(true)

    const list = renderHook(() => useToggle(['a', 'b', 'c']))
    act(() => list.result.current[1]())
    act(() => list.result.current[1]())
    expect(list.result.current[0]).toBe('c')
    act(() => list.result.current[1]('a'))
    expect(list.result.current[0]).toBe('a')
  })

  it('useCounter stays between min and max', () => {
    const { result } = renderHook(() => useCounter(1, { min: 0, max: 2 }))
    act(() => result.current[1].increment())
    act(() => result.current[1].increment())
    expect(result.current[0]).toBe(2)
    act(() => result.current[1].set(-5))
    expect(result.current[0]).toBe(0)
    act(() => result.current[1].reset())
    expect(result.current[0]).toBe(1)
  })

  it('useDebouncedValue waits for the value to settle', () => {
    jest.useFakeTimers()
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: 'a' } }
    )
    rerender({ value: 'b' })
    expect(result.current[0]).toBe('a')
    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current[0]).toBe('b')
  })

  it('useThrottledCallback runs the first call and the last one after the wait', () => {
    jest.useFakeTimers()
    const fn = jest.fn()
    const { result } = renderHook(() => useThrottledCallback(fn, 100))
    result.current(1)
    result.current(2)
    result.current(3)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(1)
    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(3)
  })

  it('useListState changes the list', () => {
    const { result } = renderHook(() => useListState([1, 2, 3]))
    act(() => result.current[1].append(4))
    act(() => result.current[1].remove(0))
    act(() => result.current[1].reorder({ from: 0, to: 2 }))
    expect(result.current[0]).toEqual([3, 4, 2])
  })

  it('useQueue moves the items over the limit to the queue', () => {
    const { result } = renderHook(() =>
      useQueue({ initialValues: [1, 2, 3], limit: 2 })
    )
    expect(result.current.state).toEqual([1, 2])
    expect(result.current.queue).toEqual([3])
    act(() => result.current.update((items) => items.slice(1)))
    expect(result.current.state).toEqual([2, 3])
    expect(result.current.queue).toEqual([])
  })

  it('useStateHistory goes back and forward', () => {
    const { result } = renderHook(() => useStateHistory(1))
    act(() => result.current[1].set(2))
    act(() => result.current[1].set(3))
    act(() => result.current[1].back(2))
    expect(result.current[0]).toBe(1)
    act(() => result.current[1].forward())
    expect(result.current[0]).toBe(2)
    act(() => result.current[1].set(9))
    expect(result.current[2].history).toEqual([1, 2, 9])
  })

  it('useUncontrolled follows value when it is set', () => {
    const onChange = jest.fn()
    const { result } = renderHook(() =>
      useUncontrolled({ value: 'a', onChange })
    )
    expect(result.current[2]).toBe(true)
    act(() => result.current[1]('b'))
    expect(result.current[0]).toBe('a')
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('useLocalStorage reads, writes and removes the value', () => {
    window.localStorage.setItem('key', JSON.stringify('saved'))
    const { result } = renderHook(() =>
      useLocalStorage({ key: 'key', defaultValue: 'default' })
    )
    expect(result.current[0]).toBe('saved')
    act(() => result.current[1]('next'))
    expect(window.localStorage.getItem('key')).toBe('"next"')
    act(() => result.current[2]())
    expect(window.localStorage.getItem('key')).toBeNull()
    expect(result.current[0]).toBe('default')
  })

  it('useDidUpdate skips the first render', () => {
    const fn = jest.fn()
    const { rerender } = renderHook(({ dep }) => useDidUpdate(fn, [dep]), {
      initialProps: { dep: 1 }
    })
    expect(fn).not.toHaveBeenCalled()
    rerender({ dep: 2 })
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
