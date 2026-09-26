import { act, renderHook } from '@testing-library/react'
import { useBodyScroll } from '..'

const flush = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)))

describe('useBodyScroll', () => {
  it('locks the page body until it is released', async () => {
    const { result } = renderHook(() => useBodyScroll())
    expect(document.body.style.overflow).not.toBe('hidden')

    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)
    expect(document.body.style.overflow).toBe('hidden')

    act(() => result.current[1](false))
    await flush()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('locks the element of the ref it is given, not the body', async () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const ref = { current: el }
    const { result } = renderHook(() => useBodyScroll(ref))

    act(() => result.current[1](true))
    expect(el.style.overflow).toBe('hidden')
    expect(document.body.style.overflow).not.toBe('hidden')

    act(() => result.current[1](false))
    await flush()
    expect(el.style.overflow).not.toBe('hidden')
    el.remove()
  })

  it('does nothing while the ref has no element yet', () => {
    const ref = { current: null }
    const { result } = renderHook(() => useBodyScroll(ref))
    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
