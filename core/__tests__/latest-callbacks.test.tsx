import React from 'react'
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen
} from '@testing-library/react'
import {
  BolioUIProvider,
  Checkbox,
  KeyCode,
  Modal,
  Popover,
  useClipboard,
  useCurrentState,
  useKeyboard
} from '..'
import useResize from '../utils/use-resize'
import useDrag, { DraggingEvent } from '../utils/use-drag'
import useDOMObserver from '../utils/use-dom-observer'

// Code that sets up a listener once has to call the callback of the latest
// render. These used to call the one of the first render.
describe('listeners call the latest callback', () => {
  it('useResize', () => {
    const first = jest.fn()
    const second = jest.fn()
    const { rerender } = renderHook(({ cb }) => useResize(cb), {
      initialProps: { cb: first }
    })
    expect(first).toHaveBeenCalledTimes(1)

    rerender({ cb: second })
    expect(second).not.toHaveBeenCalled()
    window.dispatchEvent(new Event('resize'))
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('useKeyboard', () => {
    const first = jest.fn()
    const second = jest.fn()
    const { rerender } = renderHook(
      ({ handler }) => useKeyboard(handler, KeyCode.Escape),
      { initialProps: { handler: first } }
    )
    rerender({ handler: second })
    fireEvent.keyDown(document, { keyCode: 27 })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('useDOMObserver', async () => {
    const el = document.createElement('div')
    const ref = { current: el }
    const first = jest.fn()
    const second = jest.fn()
    const { rerender } = renderHook(({ cb }) => useDOMObserver(ref, cb), {
      initialProps: { cb: first }
    })
    rerender({ cb: second })
    await act(async () => {
      el.appendChild(document.createElement('span'))
    })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('useDrag', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    const ref = { current: el }
    const first = jest.fn()
    const second = jest.fn()
    const ended = jest.fn()
    const { rerender } = renderHook(
      ({ dragging }) => useDrag(ref, dragging, undefined, ended),
      { initialProps: { dragging: first } }
    )

    fireEvent.mouseDown(el)
    fireEvent.mouseMove(window, { clientX: 20 })
    expect(first).toHaveBeenCalledWith<[DraggingEvent]>({
      startX: 0,
      currentX: 20
    })

    rerender({ dragging: second })
    fireEvent.mouseMove(window, { clientX: 35 })
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledWith<[DraggingEvent]>({
      startX: 0,
      currentX: 35
    })

    fireEvent.mouseUp(window)
    expect(ended).toHaveBeenCalledTimes(1)
    el.remove()
  })

  it('useClipboard reports a failure to the current onError', () => {
    const first = jest.fn()
    const second = jest.fn()
    const { result, rerender } = renderHook(
      ({ onError }) => useClipboard({ onError }),
      { initialProps: { onError: first }, wrapper: BolioUIProvider }
    )
    rerender({ onError: second })
    // there is no document.execCommand in jsdom, so copying fails
    act(() => result.current.copy('text'))
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('Checkbox.Group calls the current onChange', () => {
    const first = jest.fn()
    const second = jest.fn()
    // the same array on every render, or the group updates on each of them
    const value: string[] = []
    const ui = (onChange: () => void) => (
      <BolioUIProvider>
        <Checkbox.Group value={value} onChange={onChange}>
          <Checkbox value="a">A</Checkbox>
        </Checkbox.Group>
      </BolioUIProvider>
    )
    const { rerender } = render(ui(first))
    rerender(ui(second))
    fireEvent.click(screen.getByRole('checkbox'))
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledWith(['a'])
  })

  it('a Modal action closes it through the current onClose', () => {
    const first = jest.fn()
    const second = jest.fn()
    const ui = (onClose: () => void) => (
      <BolioUIProvider>
        <Modal visible onClose={onClose}>
          <Modal.Title>Title</Modal.Title>
          <Modal.Action onClick={(event) => event.close()}>Close</Modal.Action>
        </Modal>
      </BolioUIProvider>
    )
    const { rerender } = render(ui(first))
    rerender(ui(second))
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalled()
  })
})

describe('setters and effects that must not rerun', () => {
  it('the setter of useCurrentState is the same function on every render', () => {
    const { result, rerender } = renderHook(() => useCurrentState(0))
    const setter = result.current[1]
    act(() => setter((last) => last + 1))
    rerender()
    expect(result.current[1]).toBe(setter)
    expect(result.current[0]).toBe(1)
    expect(result.current[2].current).toBe(1)
  })

  it('a controlled Popover tells its handler once per change, not per render', () => {
    const calls: boolean[] = []
    const ui = (visible: boolean) => (
      <BolioUIProvider>
        <Popover
          visible={visible}
          onVisibleChange={(next) => calls.push(next)}
          content={<span>Body</span>}
        >
          <span>Trigger</span>
        </Popover>
      </BolioUIProvider>
    )
    const { rerender } = render(ui(true))
    // a new inline handler on every render
    rerender(ui(true))
    rerender(ui(true))
    expect(calls).toEqual([true])
    rerender(ui(false))
    expect(calls).toEqual([true, false])
  })
})
