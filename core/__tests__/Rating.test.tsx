import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Rating } from '..'

// jsdom has no PointerEvent, and without it the position of the pointer is lost
beforeAll(() => {
  class PointerEventMock extends MouseEvent {
    pointerId: number
    pointerType: string
    constructor(
      type: string,
      init: MouseEventInit & { pointerId?: number; pointerType?: string } = {}
    ) {
      super(type, init)
      this.pointerId = init.pointerId ?? 0
      this.pointerType = init.pointerType ?? 'mouse'
    }
  }
  Object.assign(window, { PointerEvent: PointerEventMock })

  // jsdom has no layout: each icon is 24 wide with a 6 gap, from x = 0
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: HTMLElement) {
      if (!this.hasAttribute('data-rating-item')) {
        return { left: 0, right: 0, width: 0 } as DOMRect
      }
      const index = Array.from(this.parentElement?.children ?? []).indexOf(this)
      const left = index * 30
      return { left, right: left + 24, width: 24 } as DOMRect
    })
})

afterAll(() => jest.restoreAllMocks())

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

const rating = () => screen.getByRole('slider')

// the x of the middle of the icon, or of a part of it
const at = (icon: number, part = 0.5) => icon * 30 + part * 24
const press = (x: number, pointerType = 'mouse') =>
  fireEvent.pointerDown(rating(), { clientX: x, pointerId: 1, pointerType })
const move = (x: number, pointerType = 'mouse') =>
  fireEvent.pointerMove(rating(), { clientX: x, pointerId: 1, pointerType })
const release = (x: number, pointerType = 'mouse') =>
  fireEvent.pointerUp(rating(), { clientX: x, pointerId: 1, pointerType })
const click = (x: number) => {
  press(x)
  release(x)
}

// how much of an icon is filled, from 0 to 1
const fillOf = (item: Element) =>
  (item.children[1] as HTMLElement).style.getPropertyValue('--rating-fill')

describe('<Rating />', () => {
  it('is a slider that starts at 0', () => {
    wrap(<Rating />)
    expect(rating()).toHaveAttribute('aria-valuenow', '0')
    expect(rating()).toHaveAttribute('aria-valuemax', '5')
    expect(rating()).toHaveAttribute('aria-valuetext', '0 of 5')
  })

  it('picks the icon that was clicked', () => {
    const onChange = jest.fn()
    wrap(<Rating onChange={onChange} />)
    click(at(2))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(3)
    expect(rating()).toHaveAttribute('aria-valuenow', '3')
  })

  it('does not call onChange for a value it already has', () => {
    const onChange = jest.fn()
    wrap(<Rating value={3} onChange={onChange} />)
    click(at(2))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('picks the half of an icon with precision 0.5', () => {
    const onChange = jest.fn()
    wrap(<Rating precision={0.5} onChange={onChange} />)
    click(at(2, 0.25))
    expect(onChange).toHaveBeenLastCalledWith(2.5)
    click(at(2, 0.75))
    expect(onChange).toHaveBeenLastCalledWith(3)
  })

  it('picks a quarter with precision 0.25', () => {
    const onChange = jest.fn()
    wrap(<Rating precision={0.25} onChange={onChange} />)
    click(at(0, 0.6))
    expect(onChange).toHaveBeenLastCalledWith(0.75)
  })

  it('reads the gap between two icons as the first of them', () => {
    const onChange = jest.fn()
    wrap(<Rating onChange={onChange} />)
    click(57)
    expect(onChange).toHaveBeenLastCalledWith(2)
  })

  it('previews on hover with a mouse and leaves the value alone', () => {
    const onChange = jest.fn()
    const onHoverChange = jest.fn()
    wrap(<Rating value={1} onChange={onChange} onHoverChange={onHoverChange} />)
    move(at(3))
    expect(onHoverChange).toHaveBeenLastCalledWith(4)
    expect(onChange).not.toHaveBeenCalled()
    expect(rating()).toHaveAttribute('aria-valuenow', '1')
    fireEvent.pointerLeave(rating())
    expect(onHoverChange).toHaveBeenLastCalledWith(null)
  })

  it('has no hover preview for a finger, but picks by dragging', () => {
    const onChange = jest.fn()
    const onHoverChange = jest.fn()
    wrap(<Rating onChange={onChange} onHoverChange={onHoverChange} />)
    move(at(2), 'touch')
    expect(onHoverChange).not.toHaveBeenCalled()
    press(at(0), 'touch')
    move(at(4), 'touch')
    release(at(4), 'touch')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it('shrinks the icon while pressed and drips from the one picked', () => {
    wrap(<Rating />)
    const items = () =>
      document.querySelectorAll<HTMLElement>('[data-rating-item]')
    press(at(2))
    expect(items()[2]).toHaveAttribute('data-pressed')
    expect(items()[1]).not.toHaveAttribute('data-pressed')
    release(at(2))
    expect(items()[2]).not.toHaveAttribute('data-pressed')
    expect(items()[2].querySelector('[data-drip]')).toBeInTheDocument()
    expect(items()[1].querySelector('[data-drip]')).toBeNull()
  })

  it('clears the value on the same click when clearable', () => {
    const onChange = jest.fn()
    wrap(<Rating clearable value={3} onChange={onChange} />)
    click(at(2))
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('moves with the keyboard', () => {
    const onChange = jest.fn()
    wrap(<Rating initialValue={2} onChange={onChange} />)
    fireEvent.keyDown(rating(), { key: 'ArrowRight' })
    expect(onChange).toHaveBeenLastCalledWith(3)
    fireEvent.keyDown(rating(), { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenLastCalledWith(2)
    fireEvent.keyDown(rating(), { key: 'End' })
    expect(onChange).toHaveBeenLastCalledWith(5)
    fireEvent.keyDown(rating(), { key: 'Home' })
    expect(onChange).toHaveBeenLastCalledWith(0)
    fireEvent.keyDown(rating(), { key: '4' })
    expect(onChange).toHaveBeenLastCalledWith(4)
    fireEvent.keyDown(rating(), { key: 'Delete' })
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('steps by the precision and stays inside the range', () => {
    const onChange = jest.fn()
    wrap(<Rating precision={0.5} count={3} value={2.5} onChange={onChange} />)
    fireEvent.keyDown(rating(), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenLastCalledWith(3)
    onChange.mockClear()
    fireEvent.keyDown(rating(), { key: '9' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('follows the value when it is controlled', () => {
    const { rerender } = wrap(<Rating value={2} />)
    expect(rating()).toHaveAttribute('aria-valuenow', '2')
    rerender(
      <BolioUIProvider>
        <Rating value={4} />
      </BolioUIProvider>
    )
    expect(rating()).toHaveAttribute('aria-valuenow', '4')
  })

  it('shows any fraction when it is read only', () => {
    wrap(<Rating readOnly value={3.7} showValue />)
    expect(screen.getByRole('img', { name: '3.7 of 5' })).toBeInTheDocument()
    expect(screen.queryByRole('slider')).toBeNull()
    expect(screen.getByText('3.7')).toBeInTheDocument()
    const filled = document.querySelectorAll<HTMLElement>('[data-rating-item]')
    expect(fillOf(filled[3])).toBe('0.7')
  })

  it('holds a value to the step when it can be picked', () => {
    wrap(<Rating value={3.7} />)
    expect(rating()).toHaveAttribute('aria-valuenow', '4')
  })

  it('is not an input when disabled', () => {
    wrap(<Rating disabled value={2} />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-disabled', 'true')
    expect(screen.queryByRole('slider')).toBeNull()
  })

  it('submits the value with a form', () => {
    const { container } = wrap(<Rating name="score" value={4} />)
    const input = container.querySelector('input[name="score"]')
    expect(input).toHaveValue('4')
  })

  it('asks for an icon by its position', () => {
    const icon = jest.fn((index: number) => <i>{index}</i>)
    wrap(<Rating count={3} icon={icon} />)
    expect(icon).toHaveBeenCalledWith(1)
    expect(icon).toHaveBeenCalledWith(3)
  })

  it('fills only the icon of the value with highlightSelectedOnly', () => {
    wrap(<Rating readOnly highlightSelectedOnly value={2} />)
    const items = document.querySelectorAll<HTMLElement>('[data-rating-item]')
    expect(fillOf(items[1])).toBe('1')
    expect(fillOf(items[0])).toBe('0')
  })

  it('has no accessibility violations', async () => {
    wrap(<Rating aria-label="Product rating" value={3} />)
    const { violations } = await axe.run(document.body, {
      rules: { region: { enabled: false } }
    })
    expect(violations).toEqual([])
  })
})
