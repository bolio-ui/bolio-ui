import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider } from '..'
import { LineChart, AreaChart, BarChart } from '../Charts'

// jsdom has no layout: every box is 0 x 0, and Recharts draws axes and legend
// only after it measures them
beforeAll(() => {
  // reduced motion draws the final frame at once, without the animation
  window.matchMedia = ((query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined
  })) as unknown as typeof window.matchMedia
  jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 60,
    bottom: 20,
    width: 60,
    height: 20,
    toJSON: () => ({})
  })
})

const data = [
  { month: 'Jan', visits: 120, sales: 40 },
  { month: 'Feb', visits: 180, sales: 55 },
  { month: 'Mar', visits: 150, sales: 80 }
]
const series = [
  { name: 'visits', label: 'Visits' },
  { name: 'sales', label: 'Sales', color: '#8b5cf6' }
]

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>).container

const charts: Array<[string, typeof LineChart | typeof BarChart, string]> = [
  ['LineChart', LineChart, '.recharts-line'],
  ['AreaChart', AreaChart, '.recharts-area'],
  ['BarChart', BarChart, '.recharts-bar']
]

describe.each(charts)('<%s />', (_name, Chart, shape) => {
  const props = { data, dataKey: 'month', series }

  it('draws one shape per series', () => {
    const container = draw(<Chart {...props} />)
    expect(container.querySelectorAll(shape)).toHaveLength(2)
  })

  it('writes the values of the data key on the x axis', () => {
    const container = draw(<Chart {...props} />)
    const ticks = Array.from(
      container.querySelectorAll(
        '.recharts-xAxis-tick-labels .recharts-cartesian-axis-tick-value'
      )
    ).map((tick) => tick.textContent)
    expect(ticks).toEqual(['Jan', 'Feb', 'Mar'])
  })

  it('formats the y axis with valueFormatter', () => {
    const container = draw(<Chart {...props} valueFormatter={(v) => `${v}!`} />)
    const ticks = Array.from(
      container.querySelectorAll(
        '.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value'
      )
    ).map((tick) => tick.textContent)
    expect(ticks.length).toBeGreaterThan(0)
    ticks.forEach((text) => expect(text).toMatch(/!$/))
  })

  it('hides axes and grid on request', () => {
    const container = draw(
      <Chart {...props} withXAxis={false} withYAxis={false} withGrid={false} />
    )
    expect(container.querySelector('.recharts-xAxis')).toBeNull()
    expect(container.querySelector('.recharts-yAxis')).toBeNull()
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull()
  })

  it('shows the legend with the series labels only when asked', () => {
    expect(
      draw(<Chart {...props} />).querySelector('.recharts-legend-wrapper')
    ).toBeNull()
    const container = draw(<Chart {...props} withLegend />)
    const labels = Array.from(
      container.querySelectorAll('.recharts-legend-item-text')
    ).map((item) => item.textContent)
    expect(labels).toEqual(['Visits', 'Sales'])
  })

  it('uses the color of a series, and a theme color for the others', () => {
    const container = draw(<Chart {...props} />)
    const html = container.innerHTML.toLowerCase()
    expect(html).toContain('#8b5cf6')
    // the first series has no color of its own
    expect(html).toMatch(/(stroke|fill)="#(?!8b5cf6)[0-9a-f]{6}"/i)
  })

  it('forwards the ref and native props to the root', () => {
    const ref = React.createRef<HTMLDivElement>()
    const container = draw(
      <Chart
        ref={ref}
        {...props}
        aria-label="Visits per month"
        data-testid="chart"
      />
    )
    expect(ref.current).toBe(container.firstElementChild)
    expect(ref.current).toHaveAttribute('aria-label', 'Visits per month')
    expect(ref.current).toHaveAttribute('role', 'group')
  })

  it('shows the values of a point with the arrow keys', () => {
    const container = draw(<Chart {...props} />)
    const surface = container.querySelector(
      'svg.recharts-surface'
    ) as SVGElement
    const tooltip = container.querySelector(
      '.recharts-tooltip-wrapper'
    ) as HTMLElement
    expect(tooltip.style.visibility).toBe('hidden')
    surface.focus()
    fireEvent.keyDown(surface, { key: 'ArrowRight' })
    expect(tooltip.style.visibility).toBe('visible')
    expect(tooltip.textContent).toMatch(/Visits/)
  })

  it('has no accessibility violations', async () => {
    const container = draw(<Chart {...props} aria-label="Visits per month" />)
    const result = await axe.run(container, {
      rules: {
        region: { enabled: false },
        'color-contrast': { enabled: false }
      }
    })
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})

describe('stacking', () => {
  it('stacks bars and areas in one stack', () => {
    const props = { data, dataKey: 'month', series }
    const bars = draw(<BarChart {...props} stacked />)
    const rects = Array.from(
      bars.querySelectorAll('.recharts-bar-rectangle path')
    )
    expect(rects.length).toBeGreaterThan(0)
    expect(
      draw(<AreaChart {...props} stacked />).querySelectorAll('.recharts-area')
    ).toHaveLength(2)
  })
})

describe('missing values', () => {
  it('connects across null only when asked', () => {
    const gaps = [
      { x: 'a', y: 1 },
      { x: 'b', y: null },
      { x: 'c', y: 3 }
    ]
    const path = (connectNulls: boolean) =>
      draw(
        <LineChart
          data={gaps}
          dataKey="x"
          series={[{ name: 'y' }]}
          connectNulls={connectNulls}
        />
      ).querySelectorAll('.recharts-line-curve').length
    expect(path(false)).toBeGreaterThanOrEqual(1)
    expect(path(true)).toBe(1)
  })
})
