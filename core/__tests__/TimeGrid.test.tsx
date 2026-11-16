import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, TimeGrid } from '..'

const setup = (props: Partial<React.ComponentProps<typeof TimeGrid>> = {}) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <TimeGrid locale="en-US" onChange={onChange} {...props} />
    </BolioUIProvider>
  )
  return { onChange }
}

const times = () =>
  screen.getAllByRole('radio').map((radio) => radio.textContent)

describe('<TimeGrid />', () => {
  it('lists the times between start and end, by interval', () => {
    setup({ startTime: '09:00', endTime: '10:30', interval: 30, format: '24h' })
    expect(times()).toEqual(['09:00', '09:30', '10:00', '10:30'])
  })

  it('shows 12 hour labels but reports 24 hour times', () => {
    const { onChange } = setup({
      startTime: '13:00',
      endTime: '14:00',
      interval: 60,
      format: '12h'
    })
    expect(times().map((time) => time?.replace(/\s/g, ' '))).toEqual([
      '1:00 PM',
      '2:00 PM'
    ])
    fireEvent.click(screen.getAllByRole('radio')[1])
    expect(onChange).toHaveBeenCalledWith('14:00')
  })

  it('selects a time, and keeps it unless allowDeselect', () => {
    const { onChange } = setup({ format: '24h' })
    const radio = () => screen.getByRole('radio', { name: '09:30' })
    fireEvent.click(radio())
    expect(radio()).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(radio())
    expect(radio()).toHaveAttribute('aria-checked', 'true')
    expect(onChange).toHaveBeenLastCalledWith('09:30')
  })

  it('clears the time with allowDeselect', () => {
    const { onChange } = setup({
      format: '24h',
      initialValue: '09:30',
      allowDeselect: true
    })
    fireEvent.click(screen.getByRole('radio', { name: '09:30' }))
    expect(onChange).toHaveBeenLastCalledWith('')
    expect(screen.getByRole('radio', { name: '09:30' })).toHaveAttribute(
      'aria-checked',
      'false'
    )
  })

  it('disables times and skips them with the arrow keys', () => {
    setup({
      format: '24h',
      startTime: '09:00',
      endTime: '10:30',
      disabledTimes: ['09:30']
    })
    expect(screen.getByRole('radio', { name: '09:30' })).toBeDisabled()
    const first = screen.getByRole('radio', { name: '09:00' })
    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(
      screen.getByRole('radio', { name: '10:00' })
    )
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' })
    expect(document.activeElement).toBe(
      screen.getByRole('radio', { name: '10:30' })
    )
  })

  it('has one tab stop: the chosen time', () => {
    setup({ format: '24h', initialValue: '10:00' })
    const stops = screen
      .getAllByRole('radio')
      .filter((radio) => radio.getAttribute('tabindex') === '0')
    expect(stops.map((radio) => radio.textContent)).toEqual(['10:00'])
  })
})
