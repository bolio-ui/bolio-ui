import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, PinInput } from '..'

type Props = React.ComponentProps<typeof PinInput>

const setup = (props: Partial<Props> = {}) =>
  render(
    <BolioUIProvider>
      <PinInput aria-label="Code" length={4} {...props} />
    </BolioUIProvider>
  )

const boxes = () => screen.getAllByRole('textbox') as HTMLInputElement[]
const type = (index: number, text: string) =>
  fireEvent.change(boxes()[index], { target: { value: text } })
const press = (index: number, key: string) =>
  fireEvent.keyDown(boxes()[index], { key })
const text = () => boxes().map((box) => box.value)

describe('<PinInput />', () => {
  it('is a named group with one labeled box per character', () => {
    setup()
    expect(screen.getByRole('group', { name: 'Code' })).toBeInTheDocument()
    expect(boxes()).toHaveLength(4)
    expect(boxes()[2]).toHaveAccessibleName('Character 3 of 4')
    expect(boxes()[0]).toHaveAttribute('autocomplete', 'one-time-code')
  })

  it('shows the initial value and trims it to length', () => {
    setup({ initialValue: '123456' })
    expect(text()).toEqual(['1', '2', '3', '4'])
  })

  it('moves to the next box after a character', () => {
    const onChange = jest.fn()
    setup({ onChange })
    type(0, '7')
    expect(onChange).toHaveBeenLastCalledWith('7')
    expect(boxes()[1]).toHaveFocus()
    type(1, '8')
    expect(text()).toEqual(['7', '8', '', ''])
    expect(boxes()[2]).toHaveFocus()
  })

  it('calls onComplete once every box is filled', () => {
    const onComplete = jest.fn()
    setup({ onComplete, initialValue: '123' })
    expect(onComplete).not.toHaveBeenCalled()
    type(3, '4')
    expect(onComplete).toHaveBeenCalledWith('1234')
    expect(boxes()[3]).toHaveFocus()
  })

  it('fills the boxes from a paste or an autofill', () => {
    const onChange = jest.fn()
    setup({ onChange })
    type(0, '9876')
    expect(text()).toEqual(['9', '8', '7', '6'])
    expect(onChange).toHaveBeenLastCalledWith('9876')
    expect(boxes()[3]).toHaveFocus()
  })

  it('pastes from the box it was pasted into, and cuts what does not fit', () => {
    setup({ initialValue: '12' })
    type(2, '3456')
    expect(text()).toEqual(['1', '2', '3', '4'])
  })

  it('does not skip an empty box', () => {
    setup({ initialValue: '1' })
    boxes()[3].focus()
    expect(boxes()[1]).toHaveFocus()
    type(3, '5')
    expect(text()).toEqual(['1', '5', '', ''])
  })

  it('keeps only digits with numeric', () => {
    const onChange = jest.fn()
    setup({ numeric: true, onChange })
    type(0, 'a')
    expect(onChange).not.toHaveBeenCalled()
    type(0, 'a1b2')
    expect(onChange).toHaveBeenLastCalledWith('12')
    expect(boxes()[0]).toHaveAttribute('inputmode', 'numeric')
  })

  it('Backspace clears the box, and on an empty one goes back and clears', () => {
    const onChange = jest.fn()
    setup({ initialValue: '12', onChange })
    press(1, 'Backspace')
    expect(onChange).toHaveBeenLastCalledWith('1')
    expect(text()).toEqual(['1', '', '', ''])
    boxes()[1].focus()
    press(1, 'Backspace')
    expect(onChange).toHaveBeenLastCalledWith('')
    expect(boxes()[0]).toHaveFocus()
  })

  it('moves focus with the left and right arrows', () => {
    setup({ initialValue: '1234' })
    boxes()[1].focus()
    press(1, 'ArrowRight')
    expect(boxes()[2]).toHaveFocus()
    press(2, 'ArrowLeft')
    expect(boxes()[1]).toHaveFocus()
  })

  it('follows value when controlled and only reports the change', () => {
    const onChange = jest.fn()
    setup({ value: '12', onChange })
    type(2, '3')
    expect(onChange).toHaveBeenCalledWith('123')
    expect(text()).toEqual(['1', '2', '', ''])
  })

  it('masks the characters', () => {
    setup({ mask: true })
    expect(document.querySelectorAll('input[type="password"]')).toHaveLength(4)
  })

  it('locks the boxes when disabled and marks them when in error', () => {
    const { unmount } = setup({ disabled: true })
    boxes().forEach((box) => expect(box).toBeDisabled())
    unmount()
    setup({ error: true })
    boxes().forEach((box) =>
      expect(box).toHaveAttribute('aria-invalid', 'true')
    )
  })

  it('has no accessibility violations', async () => {
    const { container } = setup({ initialValue: '12' })
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
