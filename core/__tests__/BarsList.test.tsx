import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { BolioUIProvider, BarsList } from '..'

const data = [
  { name: 'React', value: 950000 },
  { name: 'Vue', value: 475000 },
  { name: 'Svelte', value: 0, color: 'red' }
]

const setup = (props: Partial<React.ComponentProps<typeof BarsList>> = {}) =>
  render(
    <BolioUIProvider>
      <BarsList data={data} {...props} />
    </BolioUIProvider>
  )

describe('<BarsList />', () => {
  it('lists each name with its formatted value', () => {
    setup()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(within(items[0]).getByText('React')).toBeInTheDocument()
    expect(within(items[0]).getByText('950,000')).toBeInTheDocument()
    expect(within(items[2]).getByText('0')).toBeInTheDocument()
  })

  it('uses valueFormatter', () => {
    setup({ valueFormatter: (value) => `${value / 1000}k` })
    expect(screen.getByText('950k')).toBeInTheDocument()
  })

  it('sizes the bars against the largest value', () => {
    setup()
    const bars = screen
      .getAllByRole('listitem')
      .map((item) => item.querySelector('div > div') as HTMLElement)
    expect(bars.map((bar) => bar.style.width)).toEqual(['100%', '50%', '0%'])
  })

  it('colors an item, with the type as the fallback', () => {
    setup()
    const bars = screen
      .getAllByRole('listitem')
      .map((item) => item.querySelector('div > div') as HTMLElement)
    expect(bars[2].style.getPropertyValue('--bars-list-color')).toBe('red')
    expect(bars[0].style.getPropertyValue('--bars-list-color')).not.toBe('')
  })

  it('shows column labels that are hidden from screen readers', () => {
    setup({ barsLabel: 'Library', valueLabel: 'Downloads' })
    expect(screen.getByText('Library').parentElement).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(screen.getByText('Downloads')).toBeInTheDocument()
  })

  it('does not break with no data or only zeros', () => {
    setup({ data: [] })
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    setup({ data: [{ name: 'None', value: 0 }] })
    expect(screen.getByText('None')).toBeInTheDocument()
  })
})
