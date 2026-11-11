import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider } from '..'
import {
  BubbleChart,
  CandlestickChart,
  CompositeChart,
  FunnelChart,
  RadialBarChart,
  SankeyChart,
  Treemap
} from '../Charts'

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
  // jsdom has no layout, and Recharts measures axes and legend
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

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>).container

const noViolations = async (container: HTMLElement) => {
  const result = await axe.run(container, {
    rules: { region: { enabled: false }, 'color-contrast': { enabled: false } }
  })
  expect(result.violations.map((v) => v.id)).toEqual([])
}

describe('<CompositeChart />', () => {
  const data = [
    { month: 'Jan', visits: 120, sales: 40, rate: 3 },
    { month: 'Feb', visits: 180, sales: 55, rate: 4 },
    { month: 'Mar', visits: 150, sales: 80, rate: 2 }
  ]
  const series = [
    { name: 'visits', label: 'Visits', type: 'bar' as const },
    { name: 'sales', label: 'Sales', type: 'area' as const },
    {
      name: 'rate',
      label: 'Rate',
      type: 'line' as const,
      yAxisId: 'right' as const
    }
  ]
  const props = { data, dataKey: 'month', series }

  it('draws each series the way its type says', () => {
    const container = draw(<CompositeChart {...props} />)
    expect(container.querySelectorAll('.recharts-bar')).toHaveLength(1)
    expect(container.querySelectorAll('.recharts-area')).toHaveLength(1)
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(1)
  })

  it('draws a line when a series has no type', () => {
    const container = draw(
      <CompositeChart {...props} series={[{ name: 'visits' }]} />
    )
    expect(container.querySelectorAll('.recharts-line')).toHaveLength(1)
  })

  it('adds a second y axis only when asked', () => {
    expect(
      draw(<CompositeChart {...props} />).querySelectorAll('.recharts-yAxis')
    ).toHaveLength(1)
    expect(
      draw(<CompositeChart {...props} withRightYAxis />).querySelectorAll(
        '.recharts-yAxis'
      )
    ).toHaveLength(2)
  })

  it('shows the legend in the order of the series', () => {
    const labels = Array.from(
      draw(<CompositeChart {...props} withLegend />).querySelectorAll(
        '.recharts-legend-item-text'
      )
    ).map((item) => item.textContent)
    expect(labels).toEqual(['Visits', 'Sales', 'Rate'])
  })

  it('names the root and has no violations', async () => {
    const container = draw(<CompositeChart {...props} aria-label="Traffic" />)
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    await noViolations(container)
  })
})

describe('<FunnelChart />', () => {
  const data = [
    { name: 'Visits', value: 1000 },
    { name: 'Sign ups', value: 400, color: '#8b5cf6' },
    { name: 'Paid', value: 120 }
  ]

  it('draws one step per item, with its color', () => {
    const container = draw(<FunnelChart data={data} />)
    expect(
      container.querySelectorAll('.recharts-funnel-trapezoid')
    ).toHaveLength(3)
    expect(container.innerHTML.toLowerCase()).toContain('#8b5cf6')
  })

  it('writes the names unless asked not to', () => {
    expect(draw(<FunnelChart data={data} />).textContent).toContain('Sign ups')
    expect(
      draw(<FunnelChart data={data} withLabels={false} />).querySelector(
        '.recharts-label-list'
      )
    ).toBeNull()
  })

  it('shows the legend in the order of the data', () => {
    const labels = Array.from(
      draw(<FunnelChart data={data} withLegend />).querySelectorAll(
        '.recharts-legend-item-text'
      )
    ).map((item) => item.textContent)
    expect(labels).toEqual(['Visits', 'Sign ups', 'Paid'])
  })

  it('names the root and has no violations', async () => {
    const container = draw(
      <FunnelChart data={data} aria-label="Signup funnel" />
    )
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    await noViolations(container)
  })
})

describe('<RadialBarChart />', () => {
  const data = [
    { name: 'Chrome', value: 65 },
    { name: 'Safari', value: 20, color: '#8b5cf6' },
    { name: 'Firefox', value: 15 }
  ]

  it('draws one bar per item, with its color', () => {
    const container = draw(<RadialBarChart data={data} />)
    expect(
      container.querySelectorAll('.recharts-radial-bar-sector')
    ).toHaveLength(3)
    expect(container.innerHTML.toLowerCase()).toContain('#8b5cf6')
  })

  it('draws the empty track only when asked', () => {
    expect(
      draw(<RadialBarChart data={data} />).querySelectorAll(
        '.recharts-radial-bar-background-sector'
      ).length
    ).toBeGreaterThan(0)
    expect(
      draw(
        <RadialBarChart data={data} withBackground={false} />
      ).querySelectorAll('.recharts-radial-bar-background-sector')
    ).toHaveLength(0)
  })

  it('shows the legend in the order of the data', () => {
    const labels = Array.from(
      draw(<RadialBarChart data={data} withLegend />).querySelectorAll(
        '.recharts-legend-item-text'
      )
    ).map((item) => item.textContent)
    expect(labels).toEqual(['Chrome', 'Safari', 'Firefox'])
  })

  it('names the root and has no violations', async () => {
    const container = draw(
      <RadialBarChart data={data} aria-label="Browser share" />
    )
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    await noViolations(container)
  })
})

describe('<BubbleChart />', () => {
  const data = [
    {
      name: 'a',
      label: 'Team A',
      points: [
        { x: 1, y: 10, z: 10 },
        { x: 2, y: 20, z: 100 }
      ]
    },
    { name: 'b', points: [{ x: 3, y: 15, z: 50 }] }
  ]

  it('draws one bubble per point', () => {
    expect(
      draw(<BubbleChart data={data} />).querySelectorAll('.recharts-symbols')
    ).toHaveLength(3)
  })

  it('sizes the bubbles by z', () => {
    const container = draw(<BubbleChart data={data} />)
    const shapes = Array.from(
      container.querySelectorAll('.recharts-symbols')
    ).map(
      (s) =>
        (s.getAttribute('d') ||
          s.querySelector('path')?.getAttribute('d')) as string
    )
    expect(new Set(shapes).size).toBe(3)
  })

  it('names the root and has no violations', async () => {
    const container = draw(
      <BubbleChart data={data} aria-label="Size by team" withLegend />
    )
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    await noViolations(container)
  })
})

describe('<Treemap />', () => {
  const flat = [
    { name: 'Alpha', value: 500 },
    { name: 'Beta', value: 300, color: '#8b5cf6' },
    { name: 'Gamma', value: 200 }
  ]
  const nested = [
    {
      name: 'Group',
      color: '#16a34a',
      children: [
        { name: 'One', value: 300 },
        { name: 'Two', value: 200 }
      ]
    },
    { name: 'Other', value: 400 }
  ]

  it('draws one rectangle per item', () => {
    expect(draw(<Treemap data={flat} />).querySelectorAll('rect')).toHaveLength(
      3
    )
  })

  it('writes the names, unless asked not to', () => {
    expect(draw(<Treemap data={flat} />).textContent).toContain('Alpha')
    expect(
      draw(<Treemap data={flat} withLabels={false} />).querySelectorAll('text')
    ).toHaveLength(0)
  })

  it('uses the color of an item', () => {
    expect(draw(<Treemap data={flat} />).innerHTML.toLowerCase()).toContain(
      '#8b5cf6'
    )
  })

  it('gives the children the color of their parent', () => {
    const fills = Array.from(
      draw(<Treemap data={nested} />).querySelectorAll('rect')
    ).map((r) => r.getAttribute('fill'))
    expect(fills.filter((fill) => fill === '#16a34a')).toHaveLength(2)
  })

  it('names the root and has no violations', async () => {
    const container = draw(<Treemap data={flat} aria-label="Sales by region" />)
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    await noViolations(container)
  })
})

describe('<SankeyChart />', () => {
  const data = {
    nodes: [
      { name: 'Visits' },
      { name: 'Search', color: '#8b5cf6' },
      { name: 'Buy' },
      { name: 'Leave' }
    ],
    links: [
      { source: 0, target: 1, value: 100 },
      { source: 1, target: 2, value: 30 },
      { source: 1, target: 3, value: 70 }
    ]
  }

  it('draws one rectangle per node and one path per link', () => {
    const container = draw(<SankeyChart data={data} />)
    expect(
      container.querySelectorAll('.recharts-sankey-node, g > rect[width]')
        .length
    ).toBeGreaterThanOrEqual(4)
    expect(
      container.querySelectorAll('.recharts-sankey-link, path[stroke-opacity]')
        .length
    ).toBeGreaterThanOrEqual(3)
  })

  it('writes the name of each node', () => {
    const text = draw(<SankeyChart data={data} />).textContent || ''
    ;['Visits', 'Search', 'Buy', 'Leave'].forEach((name) =>
      expect(text).toContain(name)
    )
  })

  it('uses the color of a node', () => {
    expect(draw(<SankeyChart data={data} />).innerHTML.toLowerCase()).toContain(
      '#8b5cf6'
    )
  })

  it('names the root and has no violations', async () => {
    const container = draw(
      <SankeyChart data={data} aria-label="Visitor flow" />
    )
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    await noViolations(container)
  })
})

describe('<CandlestickChart />', () => {
  const data = [
    { day: 'Mon', open: 100, high: 120, low: 95, close: 115 },
    { day: 'Tue', open: 115, high: 118, low: 100, close: 104 },
    { day: 'Wed', open: 104, high: 110, low: 104, close: 110 }
  ]
  const candles = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('.recharts-inactive-bar > g'))

  it('draws one candle per row, with a wick and a body', () => {
    const items = candles(draw(<CandlestickChart data={data} dataKey="day" />))
    expect(items).toHaveLength(3)
    items.forEach((item) => {
      expect(item.querySelector('line')).not.toBeNull()
      expect(item.querySelector('rect')).not.toBeNull()
    })
  })

  it('colors a rise and a fall differently, and fills only the fall', () => {
    const [rise, fall] = candles(
      draw(
        <CandlestickChart
          data={data}
          dataKey="day"
          upColor="#16a34a"
          downColor="#dc2626"
        />
      )
    )
    expect(rise.querySelector('rect')).toHaveAttribute('stroke', '#16a34a')
    expect(fall.querySelector('rect')).toHaveAttribute('stroke', '#dc2626')
    expect(fall.querySelector('rect')).toHaveAttribute('fill', '#dc2626')
    expect(rise.querySelector('rect')?.getAttribute('fill')).not.toBe('#16a34a')
  })

  it('puts the body between the open and the close inside the wick', () => {
    const [rise] = candles(draw(<CandlestickChart data={data} dataKey="day" />))
    const wick = rise.querySelector('line') as SVGLineElement
    const body = rise.querySelector('rect') as SVGRectElement
    const wickTop = Number(wick.getAttribute('y1'))
    const wickBottom = Number(wick.getAttribute('y2'))
    const top = Number(body.getAttribute('y'))
    const bottom = top + Number(body.getAttribute('height'))
    expect(wickBottom).toBeGreaterThan(wickTop)
    expect(top).toBeGreaterThanOrEqual(wickTop)
    expect(bottom).toBeLessThanOrEqual(wickBottom + 0.01)
  })

  it('keeps a candle visible when the open equals the close', () => {
    const flat = [{ day: 'Mon', open: 10, high: 12, low: 8, close: 10 }]
    const body = candles(
      draw(<CandlestickChart data={flat} dataKey="day" />)
    )[0].querySelector('rect')
    expect(Number(body?.getAttribute('height'))).toBeGreaterThan(0)
  })

  it('reads other keys with dataKeys', () => {
    const renamed = data.map((row) => ({
      day: row.day,
      o: row.open,
      h: row.high,
      l: row.low,
      c: row.close
    }))
    const container = draw(
      <CandlestickChart
        data={renamed}
        dataKey="day"
        dataKeys={{ open: 'o', high: 'h', low: 'l', close: 'c' }}
      />
    )
    expect(candles(container)).toHaveLength(3)
  })

  it('shows open, high, low and close in the tooltip', () => {
    const container = draw(
      <CandlestickChart
        data={data}
        dataKey="day"
        labels={{ open: 'Abertura' }}
      />
    )
    const surface = container.querySelector(
      'svg.recharts-surface'
    ) as SVGElement
    surface.focus()
    fireEvent.keyDown(surface, { key: 'ArrowRight' })
    const tooltip = container.querySelector(
      '.recharts-tooltip-wrapper'
    ) as HTMLElement
    expect(tooltip.textContent).toMatch(/Abertura/)
    expect(tooltip.textContent).toMatch(/High/)
    expect(tooltip.textContent).toMatch(/Low/)
    expect(tooltip.textContent).toMatch(/Close/)
  })

  it('does not break with no data', () => {
    expect(() =>
      draw(<CandlestickChart data={[]} dataKey="day" />)
    ).not.toThrow()
  })

  it('names the root and has no violations', async () => {
    const container = draw(
      <CandlestickChart data={data} dataKey="day" aria-label="Price" />
    )
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    await noViolations(container)
  })
})
