import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, GaugeChart } from '..'

const draw = (props: Partial<React.ComponentProps<typeof GaugeChart>> = {}) =>
  render(
    <BolioUIProvider>
      <GaugeChart value={60} {...props} />
    </BolioUIProvider>
  ).container

describe('<GaugeChart />', () => {
  it('writes the value in the center, formatted', () => {
    expect(draw({ value: 12345 })).toHaveTextContent('12,345')
    expect(draw({ valueFormatter: (v) => `${v}%` })).toHaveTextContent('60%')
  })

  it('replaces the value with a label', () => {
    const container = draw({ label: <b>CPU</b> })
    expect(container).toHaveTextContent('CPU')
    expect(container).not.toHaveTextContent('60')
  })

  it('is a meter with its range when it has a name', () => {
    draw({
      'aria-label': 'CPU',
      min: 10,
      max: 90,
      valueFormatter: (v) => `${v}%`
    })
    const meter = screen.getByRole('meter', { name: 'CPU' })
    expect(meter).toHaveAttribute('aria-valuenow', '60')
    expect(meter).toHaveAttribute('aria-valuemin', '10')
    expect(meter).toHaveAttribute('aria-valuemax', '90')
    expect(meter).toHaveAttribute('aria-valuetext', '60%')
  })

  it('is not a meter without a name', () => {
    draw()
    expect(screen.queryByRole('meter')).toBeNull()
  })

  it('draws a track and the filled arc', () => {
    expect(draw().querySelectorAll('path')).toHaveLength(2)
  })

  it('draws no filled arc at the minimum', () => {
    expect(draw({ value: 0 }).querySelectorAll('path')).toHaveLength(1)
  })

  it('keeps the value inside the range', () => {
    expect(draw({ value: 500 }).innerHTML).not.toMatch(/NaN|Infinity/)
    expect(draw({ value: -20 }).querySelectorAll('path')).toHaveLength(1)
  })

  it('draws one arc per section, after the track', () => {
    const container = draw({
      sections: [
        { value: 50, color: '#16a34a' },
        { value: 80, color: '#f59e0b' },
        { value: 100, color: '#dc2626' }
      ]
    })
    const paths = Array.from(container.querySelectorAll('path'))
    expect(paths).toHaveLength(4)
    expect(paths.map((p) => p.getAttribute('stroke'))).toEqual([
      expect.any(String),
      '#16a34a',
      '#f59e0b',
      '#dc2626'
    ])
  })

  it('draws a marker only for a target', () => {
    expect(draw().querySelector('line')).toBeNull()
    expect(draw({ target: 80 }).querySelector('line')).not.toBeNull()
  })

  it('rounds the caps on request', () => {
    expect(draw({ roundCaps: true }).querySelector('path')).toHaveAttribute(
      'stroke-linecap',
      'round'
    )
  })

  it('draws a full circle without collapsing it', () => {
    const container = draw({ startAngle: 0, endAngle: 360 })
    const d = container.querySelector('path')?.getAttribute('d') || ''
    expect(d).not.toMatch(/NaN/)
    const [x1, y1] = d.slice(1).split(' A')[0].split(' ').map(Number)
    const end = d.split(' ').slice(-2).map(Number)
    expect(Math.abs(end[0] - x1) + Math.abs(end[1] - y1)).toBeLessThan(0.1)
  })

  it('does not divide by zero when min equals max', () => {
    expect(draw({ min: 5, max: 5 }).innerHTML).not.toMatch(/NaN|Infinity/)
  })

  it('forwards the ref to the root', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <BolioUIProvider>
        <GaugeChart ref={ref} value={1} />
      </BolioUIProvider>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
