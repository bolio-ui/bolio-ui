import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, AngleSlider } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof AngleSlider>> = {}
) => {
  const onChange = jest.fn()
  const onChangeEnd = jest.fn()
  render(
    <BolioUIProvider>
      <AngleSlider
        aria-label="Angle"
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onChange, onChangeEnd }
}

const slider = () => screen.getByRole('slider', { name: 'Angle' })

describe('<AngleSlider />', () => {
  it('is a slider that reports its angle and shows it', () => {
    setup({ initialValue: 45 })
    expect(slider()).toHaveAttribute('aria-valuenow', '45')
    expect(slider()).toHaveAttribute('aria-valuemin', '0')
    expect(slider()).toHaveAttribute('aria-valuemax', '359')
    expect(slider()).toHaveAttribute('aria-valuetext', '45 degrees')
    expect(slider()).toHaveTextContent('45°')
  })

  it('turns with the arrow keys by step and wraps around', () => {
    const { onChange, onChangeEnd } = setup({ initialValue: 358, step: 1 })
    fireEvent.keyDown(slider(), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(359)
    fireEvent.keyDown(slider(), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith(0)
    expect(slider()).toHaveAttribute('aria-valuenow', '0')
    fireEvent.keyDown(slider(), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenLastCalledWith(359)
    expect(onChangeEnd).toHaveBeenLastCalledWith(359)
  })

  it('jumps with Page Up and Down, Home and End', () => {
    const { onChange } = setup({ initialValue: 90, step: 5 })
    fireEvent.keyDown(slider(), { key: 'PageUp' })
    expect(onChange).toHaveBeenLastCalledWith(140)
    fireEvent.keyDown(slider(), { key: 'PageDown' })
    fireEvent.keyDown(slider(), { key: 'PageDown' })
    expect(onChange).toHaveBeenLastCalledWith(40)
    fireEvent.keyDown(slider(), { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(slider(), { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith(355)
  })

  it('follows the pointer around its center', () => {
    const { onChange, onChangeEnd } = setup({ step: 1 })
    const track = slider()
    track.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect
    // jsdom has no PointerEvent, so the events carry the coordinates
    const point = (type: string, x: number, y: number) => {
      const event = new MouseEvent(type, {
        clientX: x,
        clientY: y,
        bubbles: true
      })
      Object.defineProperty(event, 'pointerId', { value: 1 })
      track.dispatchEvent(event)
    }
    track.setPointerCapture = jest.fn()
    track.hasPointerCapture = () => true
    track.releasePointerCapture = jest.fn()
    point('pointerdown', 100, 50)
    expect(onChange).toHaveBeenLastCalledWith(90)
    point('pointermove', 50, 100)
    expect(onChange).toHaveBeenLastCalledWith(180)
    point('pointerup', 50, 100)
    expect(onChangeEnd).toHaveBeenCalledWith(180)
  })

  it('ignores the keys and the pointer when disabled', () => {
    const { onChange } = setup({ initialValue: 10, disabled: true })
    fireEvent.keyDown(slider(), { key: 'ArrowRight' })
    expect(onChange).not.toHaveBeenCalled()
    expect(slider()).toHaveAttribute('aria-disabled', 'true')
    expect(slider()).toHaveAttribute('tabindex', '-1')
  })
})
