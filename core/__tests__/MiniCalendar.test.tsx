import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, MiniCalendar } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof MiniCalendar>> = {}
) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <MiniCalendar
        locale="en-US"
        defaultDate={new Date(2026, 10, 9)}
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onChange }
}

const day = (label: string) =>
  screen.getByRole('button', { name: new RegExp(label) })

describe('<MiniCalendar />', () => {
  it('shows a strip of seven days from the default date', () => {
    setup()
    expect(screen.getByText('November 2026')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(7)
    expect(day('Monday, November 9, 2026')).toBeInTheDocument()
    expect(day('Sunday, November 15, 2026')).toBeInTheDocument()
  })

  it('picks a day', () => {
    const { onChange } = setup()
    fireEvent.click(day('November 11, 2026'))
    expect(onChange).toHaveBeenCalledWith(new Date(2026, 10, 11))
    expect(day('November 11, 2026')).toHaveAttribute('aria-pressed', 'true')
  })

  it('moves the strip by its length and names both months', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Next days' }))
    expect(day('November 16, 2026')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next days' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next days' }))
    expect(
      screen.getByText('November 2026 – December 2026')
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Previous days' }))
    expect(day('November 23, 2026')).toBeInTheDocument()
  })

  it('shows fewer or more days with numberOfDays', () => {
    setup({ numberOfDays: 5 })
    expect(screen.getAllByRole('button', { pressed: false })).toHaveLength(5)
  })

  it('disables days outside min and max or rejected by shouldDisableDate', () => {
    setup({
      min: new Date(2026, 10, 10),
      max: new Date(2026, 10, 14),
      shouldDisableDate: (date) => date.getDate() === 12
    })
    expect(day('November 9, 2026')).toBeDisabled()
    expect(day('November 10, 2026')).toBeEnabled()
    expect(day('November 12, 2026')).toBeDisabled()
    expect(day('November 15, 2026')).toBeDisabled()
  })

  it('has one tab stop and moves it with the arrow keys', () => {
    setup({ initialValue: new Date(2026, 10, 11) })
    const stops = screen
      .getAllByRole('button', { pressed: true })
      .concat(screen.getAllByRole('button', { pressed: false }))
      .filter((button) => button.getAttribute('tabindex') === '0')
    expect(stops).toHaveLength(1)
    const selected = day('November 11, 2026')
    selected.focus()
    fireEvent.keyDown(selected, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(day('November 12, 2026'))
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' })
    // the strip starts on the chosen day, so it ends six days later
    expect(document.activeElement).toBe(day('November 17, 2026'))
  })
})
