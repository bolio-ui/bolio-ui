import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, QuarterPicker } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof QuarterPicker>> = {}
) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <QuarterPicker
        initialValue={new Date(2026, 4, 20)}
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onChange }
}

describe('<QuarterPicker />', () => {
  it('shows the four quarters of the year of the value', () => {
    setup()
    expect(screen.getByText('2026')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Q2 2026' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Q1 2026' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('reports the first day of the chosen quarter', () => {
    const { onChange } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Q4 2026' }))
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2026, 9, 1))
    expect(screen.getByRole('button', { name: 'Q4 2026' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('moves between years with the header buttons', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Next year' }))
    expect(screen.getByRole('button', { name: 'Q1 2027' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Previous year' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous year' }))
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('disables quarters outside min and max', () => {
    setup({ min: new Date(2026, 3, 1), max: new Date(2026, 9, 1) })
    expect(screen.getByRole('button', { name: 'Q1 2026' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Q2 2026' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Q4 2026' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Previous year' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next year' })).toBeDisabled()
  })

  it('moves the focus with the arrows, across years', () => {
    setup({ autoFocus: true })
    const focused = () => document.activeElement as HTMLElement
    expect(focused().textContent).toBe('Q2')
    fireEvent.keyDown(focused(), { key: 'ArrowDown' })
    expect(focused().getAttribute('aria-label')).toBe('Q4 2026')
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(focused().getAttribute('aria-label')).toBe('Q1 2027')
  })
})
