import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, YearPicker } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof YearPicker>> = {}
) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <YearPicker
        initialValue={new Date(2026, 0, 1)}
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onChange }
}

describe('<YearPicker />', () => {
  it('shows the page of twelve years that holds the selected one', () => {
    setup()
    expect(screen.getByText('2016 – 2027')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2026' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: '2016' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('selects a year and reports the first day of it', () => {
    const { onChange } = setup()
    fireEvent.click(screen.getByRole('button', { name: '2020' }))
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2020, 0, 1))
    expect(screen.getByRole('button', { name: '2020' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('moves between pages with the header buttons', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Next years' }))
    expect(screen.getByText('2028 – 2039')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Previous years' }))
    fireEvent.click(screen.getByRole('button', { name: 'Previous years' }))
    expect(screen.getByText('2004 – 2015')).toBeInTheDocument()
  })

  it('disables years outside min and max', () => {
    setup({ min: new Date(2020, 0, 1), max: new Date(2024, 0, 1) })
    expect(screen.getByRole('button', { name: '2019' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '2022' })).toBeEnabled()
    expect(screen.getByRole('button', { name: '2025' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next years' })).toBeDisabled()
  })

  it('moves the focus with the arrow keys and picks with Enter', () => {
    const { onChange } = setup({ autoFocus: true })
    const focused = () => document.activeElement as HTMLElement
    expect(focused().textContent).toBe('2026')
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(focused().textContent).toBe('2027')
    fireEvent.keyDown(focused(), { key: 'ArrowRight' })
    expect(screen.getByText('2028 – 2039')).toBeInTheDocument()
    fireEvent.keyDown(focused(), { key: 'ArrowDown' })
    expect(focused().textContent).toBe('2031')
    fireEvent.click(focused())
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2031, 0, 1))
  })
})
