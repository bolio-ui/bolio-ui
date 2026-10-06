import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, ColorPicker } from '..'

// jsdom has no PointerEvent, and without it the position of the pointer is lost
beforeAll(() => {
  class PointerEventMock extends MouseEvent {
    pointerId: number
    constructor(
      type: string,
      init: MouseEventInit & { pointerId?: number } = {}
    ) {
      super(type, init)
      this.pointerId = init.pointerId ?? 0
    }
  }
  Object.assign(window, { PointerEvent: PointerEventMock })
})

type Props = Partial<React.ComponentProps<typeof ColorPicker>>
const setup = (props: Props = {}) =>
  render(
    <BolioUIProvider>
      <ColorPicker aria-label="Brand color" {...props} />
    </BolioUIProvider>
  )

const slider = () =>
  screen.getByRole('slider', { name: 'Saturation and brightness' })
const hue = () => screen.getByRole('slider', { name: 'Hue' })
const hex = () => screen.getByRole('textbox', { name: 'Hex color' })
// the panel is 100 by 100 px, so a pointer position is a percentage
const panel = () => slider().parentElement as HTMLElement
const withLayout = () => {
  panel().getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect
}
const channel = (color: string, index: number) =>
  parseInt(color.slice(1 + index * 2, 3 + index * 2), 16)

describe('<ColorPicker />', () => {
  it('is a named group with a panel, a hue slider and a hex field', () => {
    setup({ initialValue: '#ff0000' })
    expect(
      screen.getByRole('group', { name: 'Brand color' })
    ).toBeInTheDocument()
    expect(slider()).toHaveAttribute(
      'aria-valuetext',
      '100% saturation, 100% brightness'
    )
    expect(hue()).toHaveValue('0')
    expect(hex()).toHaveValue('#ff0000')
  })

  it('takes a short or capitalized value', () => {
    setup({ initialValue: '#0F0' })
    expect(hex()).toHaveValue('#00ff00')
    expect(hue()).toHaveValue('120')
  })

  it('picks from the panel with the pointer', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', onChange })
    withLayout()
    // half the way right, at the top: half saturation, full brightness
    fireEvent.pointerDown(panel(), { clientX: 50, clientY: 0, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith('#ff8080')
    expect(hex()).toHaveValue('#ff8080')
  })

  it('keeps picking while the pointer is captured, and stops after', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', onChange })
    withLayout()
    let captured = false
    Object.assign(panel(), {
      setPointerCapture: () => (captured = true),
      hasPointerCapture: () => captured,
      releasePointerCapture: () => (captured = false)
    })
    fireEvent.pointerMove(panel(), { clientX: 20, clientY: 0, pointerId: 1 })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.pointerDown(panel(), { clientX: 50, clientY: 0, pointerId: 1 })
    fireEvent.pointerMove(panel(), { clientX: 100, clientY: 100, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith('#000000')
  })

  it('moves with the arrows, and Shift in bigger steps', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', onChange })
    fireEvent.keyDown(slider(), { key: 'ArrowLeft' })
    expect(slider()).toHaveAttribute('aria-valuenow', '99')
    fireEvent.keyDown(slider(), { key: 'ArrowLeft', shiftKey: true })
    expect(slider()).toHaveAttribute('aria-valuenow', '89')
    fireEvent.keyDown(slider(), { key: 'ArrowDown', shiftKey: true })
    expect(slider()).toHaveAttribute(
      'aria-valuetext',
      '89% saturation, 90% brightness'
    )
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('does not go past the edges', () => {
    setup({ initialValue: '#ff0000' })
    fireEvent.keyDown(slider(), { key: 'ArrowRight', shiftKey: true })
    fireEvent.keyDown(slider(), { key: 'ArrowUp', shiftKey: true })
    expect(slider()).toHaveAttribute(
      'aria-valuetext',
      '100% saturation, 100% brightness'
    )
  })

  it('changes the hue with its slider', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', onChange })
    fireEvent.change(hue(), { target: { value: '120' } })
    expect(onChange).toHaveBeenLastCalledWith('#00ff00')
  })

  it('keeps the hue when the color passes through a gray', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#00ff00', onChange })
    withLayout()
    // saturation 0 is white, which has no hue of its own
    fireEvent.pointerDown(panel(), { clientX: 0, clientY: 0, pointerId: 1 })
    expect(onChange).toHaveBeenLastCalledWith('#ffffff')
    fireEvent.keyDown(slider(), { key: 'ArrowRight', shiftKey: true })
    const tinted = onChange.mock.lastCall[0]
    expect(channel(tinted, 1)).toBeGreaterThan(channel(tinted, 0))
    expect(hue()).toHaveValue('120')
  })

  it('commits a typed 6 digit hex, but waits for the blur on a short one', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', onChange })
    fireEvent.change(hex(), { target: { value: '#0000ff' } })
    expect(onChange).toHaveBeenLastCalledWith('#0000ff')
    fireEvent.change(hex(), { target: { value: '#0f0' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(hex()).toHaveValue('#0f0')
    fireEvent.blur(hex())
    expect(onChange).toHaveBeenLastCalledWith('#00ff00')
    expect(hex()).toHaveValue('#00ff00')
  })

  it('restores the field when the typed text is not a color', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', onChange })
    fireEvent.change(hex(), { target: { value: '#12' } })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.blur(hex())
    expect(hex()).toHaveValue('#ff0000')
  })

  it('picks a swatch and marks the one in use', () => {
    const onChange = jest.fn()
    setup({
      initialValue: '#ff0000',
      swatches: ['#ff0000', '#00f', 'nope'],
      onChange
    })
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(screen.getByRole('button', { name: '#ff0000' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    fireEvent.click(screen.getByRole('button', { name: '#0000ff' }))
    expect(onChange).toHaveBeenLastCalledWith('#0000ff')
    expect(screen.getByRole('button', { name: '#0000ff' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('can hide the hex field', () => {
    setup({ hexInput: false })
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('follows value when controlled and only reports the change', () => {
    const onChange = jest.fn()
    const { rerender } = setup({ value: '#ff0000', onChange })
    fireEvent.change(hex(), { target: { value: '#0000ff' } })
    expect(onChange).toHaveBeenCalledWith('#0000ff')
    fireEvent.blur(hex())
    expect(hex()).toHaveValue('#ff0000')
    rerender(
      <BolioUIProvider>
        <ColorPicker
          aria-label="Brand color"
          value="#00ff00"
          onChange={onChange}
        />
      </BolioUIProvider>
    )
    expect(hex()).toHaveValue('#00ff00')
    expect(hue()).toHaveValue('120')
  })

  it('locks every part when disabled', () => {
    setup({ disabled: true, swatches: ['#ff0000'] })
    expect(slider()).toHaveAttribute('tabindex', '-1')
    expect(hue()).toBeDisabled()
    expect(hex()).toBeDisabled()
    expect(screen.getByRole('button', { name: '#ff0000' })).toBeDisabled()
    fireEvent.keyDown(slider(), { key: 'ArrowLeft' })
    expect(slider()).toHaveAttribute('aria-valuenow', '0')
  })

  it('has no accessibility violations', async () => {
    const { container } = setup({
      initialValue: '#2563eb',
      swatches: ['#dc2626']
    })
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
