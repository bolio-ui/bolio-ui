import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Heatmap } from '..'

const data = { '2026-01-05': 1, '2026-01-12': 3, '2026-01-20': 5 }
const range = { startDate: '2026-01-01', endDate: '2026-01-31' }

const draw = (props: Partial<React.ComponentProps<typeof Heatmap>> = {}) =>
  render(
    <BolioUIProvider>
      <Heatmap data={data} {...range} {...props} />
    </BolioUIProvider>
  ).container.querySelector('svg') as SVGSVGElement

const cell = (svg: SVGSVGElement, date: string) =>
  Array.from(svg.querySelectorAll('rect')).find((rect) =>
    rect.querySelector('title')?.textContent?.includes(date)
  ) as SVGRectElement

describe('<Heatmap />', () => {
  it('draws one cell for each day of the range', () => {
    expect(draw().querySelectorAll('rect')).toHaveLength(31)
  })

  it('names each cell with its date and value, and 0 when empty', () => {
    const svg = draw()
    expect(cell(svg, '2026-01-12').querySelector('title')?.textContent).toBe(
      '2026-01-12: 3'
    )
    expect(cell(svg, '2026-01-13').querySelector('title')?.textContent).toBe(
      '2026-01-13: 0'
    )
  })

  it('uses valueLabel for the cell names', () => {
    const svg = draw({ valueLabel: (date, value) => `${value} on ${date}` })
    expect(cell(svg, '2026-01-12').querySelector('title')?.textContent).toBe(
      '3 on 2026-01-12'
    )
  })

  it('colors by value: empty, lowest and highest differ', () => {
    const svg = draw()
    const fill = (date: string) => cell(svg, date).style.fill
    expect(
      new Set([fill('2026-01-13'), fill('2026-01-05'), fill('2026-01-20')]).size
    ).toBe(3)
    expect(fill('2026-01-13')).toBe(fill('2026-01-14'))
    expect(fill('2026-01-12')).not.toBe(fill('2026-01-20'))
  })

  it('uses the colors it is given, from the lowest to the highest', () => {
    const svg = draw({ colors: ['#111111', '#999999'] })
    expect(cell(svg, '2026-01-05').style.fill).toBe('#111111')
    expect(cell(svg, '2026-01-20').style.fill).toBe('#999999')
  })

  it('puts each weekday in the row of the week start', () => {
    // 2026-01-01 is a Thursday
    const monday = cell(draw(), '2026-01-01')
    const sunday = cell(draw({ firstDayOfWeek: 0 }), '2026-01-01')
    expect(Number(monday.getAttribute('y'))).toBeGreaterThan(0)
    expect(Number(monday.getAttribute('y'))).not.toBe(
      Number(sunday.getAttribute('y'))
    )
    // Monday first: Thursday is row 3, Sunday first: row 4
    expect(
      Number(sunday.getAttribute('y')) - Number(monday.getAttribute('y'))
    ).toBe(15)
  })

  it('names the month and Monday, Wednesday and Friday', () => {
    const svg = draw()
    const texts = Array.from(svg.querySelectorAll('text')).map(
      (t) => t.textContent
    )
    expect(texts).toEqual(expect.arrayContaining(['Jan', 'Mon', 'Wed', 'Fri']))
    expect(texts).not.toContain('Tue')
  })

  it('names the weekdays from Sunday when the week starts on Sunday', () => {
    const texts = Array.from(
      draw({ firstDayOfWeek: 0 }).querySelectorAll('text')
    ).map((t) => t.textContent)
    expect(texts).toEqual(expect.arrayContaining(['Mon', 'Wed', 'Fri']))
  })

  it('hides labels on request and localizes them', () => {
    const quiet = Array.from(
      draw({
        withMonthLabels: false,
        withWeekdayLabels: false
      }).querySelectorAll('text')
    )
    expect(quiet).toHaveLength(0)
    const texts = Array.from(
      draw({ locale: 'pt-BR' }).querySelectorAll('text')
    ).map((t) => t.textContent?.toLowerCase())
    expect(texts.join(' ')).toMatch(/jan/)
    expect(texts.join(' ')).toMatch(/seg/)
  })

  it('shows a legend only when asked', () => {
    expect(
      Array.from(draw().querySelectorAll('text')).some(
        (t) => t.textContent === 'Less'
      )
    ).toBe(false)
    const texts = Array.from(
      draw({ withLegend: true }).querySelectorAll('text')
    ).map((t) => t.textContent)
    expect(texts).toEqual(expect.arrayContaining(['Less', 'More']))
  })

  it('spans a year when no dates are given', () => {
    const { container } = render(
      <BolioUIProvider>
        <Heatmap data={{}} />
      </BolioUIProvider>
    )
    expect(container.querySelectorAll('rect')).toHaveLength(365)
  })

  it('does not break with empty data', () => {
    const svg = draw({ data: {} })
    expect(svg.innerHTML).not.toMatch(/NaN|Infinity/)
  })

  it('is an image when it has a name, and hidden otherwise', () => {
    expect(draw()).toHaveAttribute('aria-hidden', 'true')
    draw({ 'aria-label': 'Contributions in January' })
    expect(
      screen.getByRole('img', { name: 'Contributions in January' })
    ).toBeInTheDocument()
  })
})
