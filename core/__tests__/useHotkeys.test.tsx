import { fireEvent, renderHook } from '@testing-library/react'
import { useHotkeys } from '..'

describe('useHotkeys', () => {
  it('runs the callback of the combination that was pressed', () => {
    const onK = jest.fn()
    const onShiftK = jest.fn()
    renderHook(() =>
      useHotkeys([
        ['k', onK],
        ['shift+K', onShiftK]
      ])
    )
    fireEvent.keyDown(document.body, { key: 'k' })
    expect(onK).toHaveBeenCalledTimes(1)
    expect(onShiftK).not.toHaveBeenCalled()
    fireEvent.keyDown(document.body, { key: 'K', shiftKey: true })
    expect(onShiftK).toHaveBeenCalledTimes(1)
  })

  it('maps mod to Ctrl or Command and understands key aliases', () => {
    const onMod = jest.fn()
    const onEsc = jest.fn()
    renderHook(() =>
      useHotkeys([
        ['mod+j', onMod],
        ['esc', onEsc]
      ])
    )
    const mac = /mac|iphone|ipad|ipod/i.test(navigator.platform)
    fireEvent.keyDown(document.body, { key: 'j', metaKey: mac, ctrlKey: !mac })
    expect(onMod).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(onEsc).toHaveBeenCalledTimes(1)
  })

  it('ignores typing in fields unless the tag is allowed', () => {
    const onK = jest.fn()
    const input = document.createElement('input')
    document.body.appendChild(input)
    const { rerender } = renderHook(
      ({ tags }) => useHotkeys([['k', onK]], { ignoreTags: tags }),
      { initialProps: { tags: undefined as string[] | undefined } }
    )
    fireEvent.keyDown(input, { key: 'k' })
    expect(onK).not.toHaveBeenCalled()
    rerender({ tags: [] })
    fireEvent.keyDown(input, { key: 'k' })
    expect(onK).toHaveBeenCalledTimes(1)
    input.remove()
  })

  it('calls the latest callback and stops after unmount', () => {
    const first = jest.fn()
    const second = jest.fn()
    const { rerender, unmount } = renderHook(
      ({ fn }) => useHotkeys([['k', fn]]),
      { initialProps: { fn: first } }
    )
    rerender({ fn: second })
    fireEvent.keyDown(document.body, { key: 'k' })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
    unmount()
    fireEvent.keyDown(document.body, { key: 'k' })
    expect(second).toHaveBeenCalledTimes(1)
  })
})
