import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, Calendar, DatePicker } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

const day = (label: RegExp | string) =>
  screen.getByRole('button', { name: label })

describe('<Calendar />', () => {
  const value = new Date(2026, 0, 15) // Thursday, January 15, 2026

  it('shows the month, the weekdays and the days as a grid', () => {
    wrap(<Calendar value={value} />)
    expect(screen.getByRole('grid')).toHaveAccessibleName('January 2026')
    expect(screen.getAllByRole('columnheader')).toHaveLength(7)
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Sun')
    expect(screen.getAllByRole('button', { name: /2026$/ })).toHaveLength(31)
  })

  it('marks the selected day and calls onChange when a day is clicked', () => {
    const onChange = jest.fn()
    wrap(<Calendar value={value} onChange={onChange} />)
    expect(day(/January 15, 2026/).closest('td')).toHaveAttribute(
      'aria-selected',
      'true'
    )

    fireEvent.click(day(/January 20, 2026/))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2026, 0, 20))
  })

  it('has a single tab stop on the focused day', () => {
    wrap(<Calendar value={value} />)
    const days = screen.getAllByRole('button', { name: /2026$/ })
    expect(days.filter((d) => d.tabIndex === 0)).toHaveLength(1)
    expect(day(/January 15, 2026/).tabIndex).toBe(0)
  })

  it('moves the focus with the arrow, Home, End and Page keys', () => {
    wrap(<Calendar value={value} />)
    const start = day(/January 15, 2026/)
    start.focus()

    fireEvent.keyDown(start, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(day(/January 16, 2026/))
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
    expect(document.activeElement).toBe(day(/January 23, 2026/))
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' })
    expect(document.activeElement).toBe(day(/January 16, 2026/))
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' })
    expect(document.activeElement).toBe(day(/January 15, 2026/))

    fireEvent.keyDown(document.activeElement as Element, { key: 'Home' })
    expect(document.activeElement).toBe(day(/January 11, 2026/)) // Sunday
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' })
    expect(document.activeElement).toBe(day(/January 17, 2026/)) // Saturday

    fireEvent.keyDown(document.activeElement as Element, { key: 'PageDown' })
    expect(screen.getByRole('grid')).toHaveAccessibleName('February 2026')
    expect(document.activeElement).toBe(day(/February 17, 2026/))
    fireEvent.keyDown(document.activeElement as Element, { key: 'PageUp' })
    expect(screen.getByRole('grid')).toHaveAccessibleName('January 2026')
  })

  it('goes to the next and the previous month with the buttons', () => {
    wrap(<Calendar value={value} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    expect(screen.getByRole('grid')).toHaveAccessibleName('February 2026')
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous month' }))
    expect(screen.getByRole('grid')).toHaveAccessibleName('December 2025')
  })

  it('selects with Enter and Space', () => {
    const onChange = jest.fn()
    wrap(<Calendar value={value} onChange={onChange} />)
    const start = day(/January 15, 2026/)
    fireEvent.keyDown(start, { key: 'Enter' })
    fireEvent.keyDown(start, { key: ' ' })
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('disables the days outside min and max', () => {
    const onChange = jest.fn()
    wrap(
      <Calendar
        value={value}
        min={new Date(2026, 0, 10)}
        max={new Date(2026, 0, 20)}
        onChange={onChange}
      />
    )
    expect(day(/January 9, 2026/)).toBeDisabled()
    expect(day(/January 21, 2026/)).toBeDisabled()
    expect(day(/January 10, 2026/)).toBeEnabled()

    fireEvent.click(day(/January 21, 2026/))
    expect(onChange).not.toHaveBeenCalled()

    const start = day(/January 20, 2026/)
    start.focus()
    fireEvent.keyDown(start, { key: 'ArrowRight' })
    expect(document.activeElement).toBe(start)
  })

  it('marks today', () => {
    const today = new Date()
    wrap(<Calendar value={today} />)
    const current = screen
      .getAllByRole('button', { name: /\d{4}$/ })
      .filter((d) => d.getAttribute('aria-current') === 'date')
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent(String(today.getDate()))
  })

  it('uses the locale for the names', () => {
    wrap(<Calendar value={value} locale="pt-BR" />)
    expect(screen.getByRole('grid')).toHaveAccessibleName(/janeiro de 2026/i)
  })

  it('starts the week on the chosen day', () => {
    wrap(<Calendar value={value} weekStartsOn={1} />)
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('Mon')
  })
})

describe('<DatePicker />', () => {
  const open = () =>
    fireEvent.click(screen.getByRole('button', { name: 'Choose date' }))

  it('accepts a typed ISO date', () => {
    const onChange = jest.fn()
    wrap(<DatePicker aria-label="Birthday" onChange={onChange} />)
    const input = screen.getByRole('textbox', { name: 'Birthday' })
    fireEvent.change(input, { target: { value: '2026-03-09' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2026, 2, 9))
  })

  it('ignores an invalid date and restores the last valid one on blur', () => {
    const onChange = jest.fn()
    wrap(
      <DatePicker
        aria-label="Birthday"
        initialValue={new Date(2026, 0, 15)}
        onChange={onChange}
      />
    )
    const input = screen.getByRole('textbox', { name: 'Birthday' })
    expect(input).toHaveValue('2026-01-15')

    fireEvent.change(input, { target: { value: '2026-02-31' } })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.blur(input)
    expect(input).toHaveValue('2026-01-15')
  })

  it('clears the value when the text is emptied', () => {
    const onChange = jest.fn()
    wrap(
      <DatePicker
        aria-label="Birthday"
        initialValue={new Date(2026, 0, 15)}
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } })
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('does not accept a typed date outside min and max', () => {
    const onChange = jest.fn()
    wrap(
      <DatePicker
        aria-label="Birthday"
        min={new Date(2026, 0, 10)}
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '2026-01-05' }
    })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('opens the calendar in a dialog and picks a day', () => {
    const onChange = jest.fn()
    wrap(
      <DatePicker
        aria-label="Birthday"
        initialValue={new Date(2026, 0, 15)}
        onChange={onChange}
      />
    )
    const button = screen.getByRole('button', { name: 'Choose date' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    open()
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog', { name: 'Choose date' })).toBeVisible()
    // the focus goes to the day of the current value
    expect(document.activeElement).toBe(day(/January 15, 2026/))

    fireEvent.click(day(/January 22, 2026/))
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2026, 0, 22))
    expect(screen.getByRole('textbox')).toHaveValue('2026-01-22')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(screen.getByRole('textbox'))
  })

  it('closes with Escape and gives the focus back to the button', () => {
    wrap(<DatePicker aria-label="Birthday" />)
    open()
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Choose date' })
    )
  })

  it('follows the value when it is controlled', () => {
    const { rerender } = wrap(
      <DatePicker aria-label="Birthday" value={new Date(2026, 0, 15)} />
    )
    expect(screen.getByRole('textbox')).toHaveValue('2026-01-15')
    rerender(
      <BolioUIProvider>
        <DatePicker aria-label="Birthday" value={new Date(2026, 5, 1)} />
      </BolioUIProvider>
    )
    expect(screen.getByRole('textbox')).toHaveValue('2026-06-01')
  })

  it('disables the input and the button', () => {
    wrap(<DatePicker aria-label="Birthday" disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Choose date' })).toBeDisabled()
  })
})
