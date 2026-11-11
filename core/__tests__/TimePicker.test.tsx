import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, TimePicker } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof TimePicker>> = {}
) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <TimePicker aria-label="Time" onChange={onChange} {...props} />
    </BolioUIProvider>
  )
  return {
    hours: screen.getByRole('textbox', { name: 'Hours' }) as HTMLInputElement,
    minutes: screen.getByRole('textbox', {
      name: 'Minutes'
    }) as HTMLInputElement,
    onChange
  }
}

const type = (input: HTMLInputElement, text: string) =>
  fireEvent.change(input, { target: { value: text } })

describe('<TimePicker />', () => {
  it('is a named group of segments', () => {
    setup()
    expect(screen.getByRole('group', { name: 'Time' })).toBeInTheDocument()
  })

  it('reports the time once hours and minutes are filled and moves on', () => {
    const { hours, minutes, onChange } = setup()
    type(hours, '09')
    expect(minutes).toHaveFocus()
    expect(onChange).not.toHaveBeenCalled()
    type(minutes, '30')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith('09:30')
  })

  it('moves on after a first digit that cannot start a bigger number', () => {
    const { hours, minutes } = setup()
    hours.focus()
    type(hours, '1')
    expect(hours).toHaveFocus()
    type(hours, '9')
    expect(minutes).toHaveFocus()
    type(minutes, '7')
    expect(minutes.value).toBe('7')
  })

  it('pads one digit on blur and keeps numbers in range', () => {
    const { hours, minutes, onChange } = setup()
    type(hours, '5')
    fireEvent.blur(hours)
    expect(hours.value).toBe('05')
    type(minutes, '99')
    expect(minutes.value).toBe('59')
    expect(onChange).toHaveBeenLastCalledWith('05:59')
  })

  it('steps with the arrow keys and wraps around', () => {
    const { hours, minutes } = setup({ initialValue: '23:59', minutesStep: 5 })
    fireEvent.keyDown(hours, { key: 'ArrowUp' })
    expect(hours.value).toBe('00')
    fireEvent.keyDown(hours, { key: 'ArrowDown' })
    expect(hours.value).toBe('23')
    fireEvent.keyDown(minutes, { key: 'ArrowUp' })
    expect(minutes.value).toBe('04')
  })

  it('goes back a segment with Backspace on an empty one', () => {
    const { hours, minutes } = setup()
    minutes.focus()
    fireEvent.keyDown(minutes, { key: 'Backspace' })
    expect(hours).toHaveFocus()
  })

  it('reports an empty string when everything is cleared', () => {
    const { hours, minutes, onChange } = setup({ initialValue: '08:15' })
    type(hours, '')
    expect(onChange).not.toHaveBeenCalled()
    type(minutes, '')
    expect(onChange).toHaveBeenLastCalledWith('')
  })

  it('supports seconds', () => {
    const { hours, minutes, onChange } = setup({ withSeconds: true })
    const seconds = screen.getByRole('textbox', { name: 'Seconds' })
    type(hours, '10')
    type(minutes, '20')
    expect(onChange).not.toHaveBeenCalled()
    type(seconds as HTMLInputElement, '30')
    expect(onChange).toHaveBeenLastCalledWith('10:20:30')
  })

  it('shows and reports the 12 hour clock as a 24 hour value', () => {
    const { hours, minutes, onChange } = setup({
      format: '12h',
      initialValue: '15:45'
    })
    const period = screen.getByRole('combobox', { name: 'AM or PM' })
    expect(hours.value).toBe('03')
    expect(minutes.value).toBe('45')
    expect(period).toHaveValue('PM')
    fireEvent.change(period, { target: { value: 'AM' } })
    expect(onChange).toHaveBeenLastCalledWith('03:45')
    type(hours, '12')
    expect(onChange).toHaveBeenLastCalledWith('00:45')
    fireEvent.change(period, { target: { value: 'PM' } })
    expect(onChange).toHaveBeenLastCalledWith('12:45')
  })

  it('waits for AM or PM in the 12 hour clock', () => {
    const { hours, minutes, onChange } = setup({ format: '12h' })
    type(hours, '09')
    type(minutes, '00')
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'AM' } })
    expect(onChange).toHaveBeenLastCalledWith('09:00')
  })

  it('follows the controlled value', () => {
    const { rerender } = render(
      <BolioUIProvider>
        <TimePicker aria-label="Time" value="08:00" />
      </BolioUIProvider>
    )
    const hours = screen.getByRole('textbox', { name: 'Hours' })
    expect(hours).toHaveValue('08')
    rerender(
      <BolioUIProvider>
        <TimePicker aria-label="Time" value="17:30" />
      </BolioUIProvider>
    )
    expect(hours).toHaveValue('17')
    rerender(
      <BolioUIProvider>
        <TimePicker aria-label="Time" value="" />
      </BolioUIProvider>
    )
    expect(hours).toHaveValue('')
  })

  it('disables every segment', () => {
    setup({ disabled: true, format: '12h' })
    screen.getAllByRole('textbox').forEach((box) => expect(box).toBeDisabled())
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})
