import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, MonthPicker } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof MonthPicker>> = {}
) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <MonthPicker
        aria-label="Month"
        initialValue={new Date(2026, 10, 1)}
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onChange }
}

describe('<MonthPicker />', () => {
  it('shows the 12 months of the selected year', () => {
    setup()
    expect(screen.getByText('2026')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { pressed: undefined })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'November 2026' })
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('button', { name: 'January 2026' })
    ).toHaveAttribute('aria-pressed', 'false')
  })

  it('selects a month and reports the first day of it', () => {
    const { onChange } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'March 2026' }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2026, 2, 1))
    expect(screen.getByRole('button', { name: 'March 2026' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('moves between years with the header buttons', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Next year' }))
    expect(screen.getByText('2027')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'January 2027' })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Previous year' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous year' }))
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('disables months outside min and max', () => {
    setup({ min: new Date(2026, 2, 1), max: new Date(2026, 8, 1) })
    expect(screen.getByRole('button', { name: 'February 2026' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'March 2026' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'September 2026' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'October 2026' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous year' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next year' })).toBeDisabled()
  })

  it('moves the focus with the arrow keys and across years', () => {
    setup({ initialValue: new Date(2026, 11, 1), autoFocus: true })
    const december = screen.getByRole('button', { name: 'December 2026' })
    expect(december).toHaveFocus()
    fireEvent.keyDown(december, { key: 'ArrowRight' })
    expect(screen.getByText('2027')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'January 2027' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
    expect(screen.getByRole('button', { name: 'April 2027' })).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'PageUp' })
    expect(screen.getByRole('button', { name: 'April 2026' })).toHaveFocus()
  })

  it('has one tab stop', () => {
    setup()
    const stops = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('tabindex') === '0')
    expect(stops.map((button) => button.getAttribute('aria-label'))).toEqual([
      'November 2026'
    ])
  })

  it('follows the controlled value', () => {
    const { rerender } = render(
      <BolioUIProvider>
        <MonthPicker value={new Date(2026, 0, 1)} />
      </BolioUIProvider>
    )
    expect(
      screen.getByRole('button', { name: 'January 2026' })
    ).toHaveAttribute('aria-pressed', 'true')
    rerender(
      <BolioUIProvider>
        <MonthPicker value={new Date(2028, 4, 1)} />
      </BolioUIProvider>
    )
    expect(screen.getByText('2028')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'May 2028' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })
})
