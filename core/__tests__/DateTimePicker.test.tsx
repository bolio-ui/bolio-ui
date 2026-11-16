import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, DateTimePicker } from '..'

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>)

const date = () => screen.getByLabelText('Date') as HTMLInputElement
const hours = () => screen.getByLabelText('Hours') as HTMLInputElement
const minutes = () => screen.getByLabelText('Minutes') as HTMLInputElement

describe('<DateTimePicker />', () => {
  it('shows the day and the time of the value', () => {
    draw(<DateTimePicker initialValue={new Date(2026, 10, 12, 9, 30)} />)
    expect(date().value).toBe('2026-11-12')
    expect(hours().value).toBe('09')
    expect(minutes().value).toBe('30')
  })

  it('uses midnight when a day is typed before any time', () => {
    const onChange = jest.fn()
    draw(<DateTimePicker onChange={onChange} />)
    fireEvent.change(date(), { target: { value: '2026-11-12' } })
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 10, 12, 0, 0))
  })

  it('keeps the time when the day changes, and the day when the time does', () => {
    const onChange = jest.fn()
    draw(
      <DateTimePicker
        initialValue={new Date(2026, 10, 12, 9, 30)}
        onChange={onChange}
      />
    )
    fireEvent.change(date(), { target: { value: '2026-12-01' } })
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 11, 1, 9, 30))
    fireEvent.change(hours(), { target: { value: '18' } })
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 11, 1, 18, 30))
  })

  it('waits for a day when the time is typed first', () => {
    const onChange = jest.fn()
    draw(<DateTimePicker onChange={onChange} />)
    fireEvent.change(hours(), { target: { value: '14' } })
    fireEvent.change(minutes(), { target: { value: '45' } })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.change(date(), { target: { value: '2026-11-12' } })
    expect(onChange).toHaveBeenLastCalledWith(new Date(2026, 10, 12, 14, 45))
  })

  it('clears the value when the day is cleared', () => {
    const onChange = jest.fn()
    draw(
      <DateTimePicker
        initialValue={new Date(2026, 10, 12, 9, 30)}
        onChange={onChange}
      />
    )
    fireEvent.change(date(), { target: { value: '' } })
    expect(onChange).toHaveBeenLastCalledWith(null)
  })
})
