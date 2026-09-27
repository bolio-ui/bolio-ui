import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, NumberInput } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof NumberInput>> = {}
) => {
  const onChange = jest.fn()
  const utils = render(
    <BolioUIProvider>
      <NumberInput aria-label="Quantity" onChange={onChange} {...props} />
    </BolioUIProvider>
  )
  return { ...utils, input: screen.getByRole('spinbutton'), onChange }
}

const type = (input: HTMLElement, value: string) =>
  fireEvent.change(input, { target: { value } })

describe('<NumberInput />', () => {
  it('is a named spinbutton that exposes its value and limits', () => {
    const { input } = setup({ initialValue: 3, min: 0, max: 10 })
    expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBe(input)
    expect(input).toHaveValue('3')
    expect(input).toHaveAttribute('aria-valuenow', '3')
    expect(input).toHaveAttribute('aria-valuemin', '0')
    expect(input).toHaveAttribute('aria-valuemax', '10')
  })

  it('steps with the arrows, Page Up and Down, Home and End', () => {
    const { input, onChange } = setup({
      initialValue: 5,
      min: 0,
      max: 100,
      step: 2
    })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('7')
    expect(onChange).toHaveBeenLastCalledWith(7)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveValue('5')
    fireEvent.keyDown(input, { key: 'PageUp' })
    expect(input).toHaveValue('25')
    fireEvent.keyDown(input, { key: 'PageDown' })
    expect(input).toHaveValue('5')
    fireEvent.keyDown(input, { key: 'End' })
    expect(input).toHaveValue('100')
    fireEvent.keyDown(input, { key: 'Home' })
    expect(input).toHaveValue('0')
  })

  it('stays within min and max when stepping', () => {
    const { input } = setup({ initialValue: 9, max: 10 })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('10')
  })

  it('steps with the buttons and disables them at the limits', () => {
    const { input } = setup({ initialValue: 1, min: 0, max: 2 })
    const decrease = screen.getByRole('button', { name: 'Decrease' })
    const increase = screen.getByRole('button', { name: 'Increase' })
    expect(increase).toHaveAttribute('tabindex', '-1')
    expect(increase).toHaveAttribute('aria-controls', input.id)

    fireEvent.click(increase)
    expect(input).toHaveValue('2')
    expect(increase).toBeDisabled()
    fireEvent.click(decrease)
    fireEvent.click(decrease)
    expect(input).toHaveValue('0')
    expect(decrease).toBeDisabled()
  })

  it('keeps floating point steps exact', () => {
    const { input } = setup({ initialValue: 0.1, step: 0.2 })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('0.3')
  })

  it('accepts only numbers while typing and reports the parsed value', () => {
    const { input, onChange } = setup()
    type(input, '12')
    expect(onChange).toHaveBeenLastCalledWith(12)
    type(input, '12a')
    expect(input).toHaveValue('12')
    type(input, '1,5')
    expect(input).toHaveValue('1,5')
    expect(onChange).toHaveBeenLastCalledWith(1.5)
    type(input, '')
    expect(onChange).toHaveBeenLastCalledWith(null)
  })

  it('clamps and rounds what was typed on blur', () => {
    const { input, onChange } = setup({ min: 1, max: 5, precision: 1 })
    type(input, '9.87')
    fireEvent.blur(input)
    expect(input).toHaveValue('5')
    expect(onChange).toHaveBeenLastCalledWith(5)
    type(input, '2.46')
    fireEvent.blur(input)
    expect(input).toHaveValue('2.5')
  })

  it('can be controlled', () => {
    const Controlled = () => {
      const [value, setValue] = useState<number | null>(4)
      return (
        <>
          <NumberInput aria-label="Qty" value={value} onChange={setValue} />
          <button onClick={() => setValue(10)}>Set</button>
        </>
      )
    }
    render(
      <BolioUIProvider>
        <Controlled />
      </BolioUIProvider>
    )
    const input = screen.getByRole('spinbutton')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('5')
    fireEvent.click(screen.getByRole('button', { name: 'Set' }))
    expect(input).toHaveValue('10')
  })

  it('does not change when disabled or read only', () => {
    const { input, onChange } = setup({ initialValue: 1, readOnly: true })
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('1')
    expect(screen.getByRole('button', { name: 'Increase' })).toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('links the label and the error message', () => {
    render(
      <BolioUIProvider>
        <NumberInput error errorMessage="Too many">
          Guests
        </NumberInput>
      </BolioUIProvider>
    )
    const input = screen.getByRole('spinbutton', { name: 'Guests' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Too many')
  })

  it('has no axe violations', async () => {
    const { container } = setup({ initialValue: 2, min: 0 })
    const result = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } }
    })
    expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
})
