import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider } from '..'
import { PieChart, DonutChart } from '../Charts'

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
  // jsdom has no layout, and Recharts measures the legend
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
  { name: 'Direct', value: 300 },
  { name: 'Search', value: 500, color: '#8b5cf6' },
  { name: 'Social', value: 200 }
]

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>).container

const charts: Array<[string, typeof PieChart | typeof DonutChart]> = [
  ['PieChart', PieChart],
  ['DonutChart', DonutChart]
]

describe.each(charts)('<%s />', (_name, Chart) => {
  it('draws one slice per item', () => {
    const container = draw(<Chart data={data} />)
    expect(container.querySelectorAll('.recharts-pie-sector')).toHaveLength(3)
  })

  it('uses the color of an item, and theme colors for the others', () => {
    const html = draw(<Chart data={data} />).innerHTML.toLowerCase()
    expect(html).toContain('#8b5cf6')
    expect(html).toMatch(/fill="#(?!8b5cf6)[0-9a-f]{6}"/)
  })

  it('writes no labels until asked, then the value by default', () => {
    expect(draw(<Chart data={data} />).querySelector('svg text')).toBeNull()
    const container = draw(<Chart data={data} withLabels />)
    const labels = Array.from(container.querySelectorAll('svg text')).map(
      (label) => label.textContent
    )
    expect(labels).toEqual(['300', '500', '200'])
  })

  it('writes names or percentages in the labels', () => {
    const text = (labelsType: 'name' | 'percent') =>
      Array.from(
        draw(
          <Chart data={data} withLabels labelsType={labelsType} />
        ).querySelectorAll('svg text')
      ).map((label) => label.textContent)
    expect(text('name')).toEqual(['Direct', 'Search', 'Social'])
    expect(text('percent')).toEqual(['30%', '50%', '20%'])
  })

  it('formats the label values with valueFormatter', () => {
    const container = draw(
      <Chart
        data={data}
        withLabels
        valueFormatter={(value) => `${value} users`}
      />
    )
    expect(container.querySelector('svg text')?.textContent).toBe('300 users')
  })

  it('shows the legend in the order of the data, only when asked', () => {
    expect(
      draw(<Chart data={data} />).querySelector('.recharts-legend-wrapper')
    ).toBeNull()
    const labels = Array.from(
      draw(<Chart data={data} withLegend />).querySelectorAll(
        '.recharts-legend-item-text'
      )
    ).map((item) => item.textContent)
    expect(labels).toEqual(['Direct', 'Search', 'Social'])
  })

  it('does not break with no data or only zeros', () => {
    expect(() =>
      draw(<Chart data={[]} withLabels labelsType="percent" />)
    ).not.toThrow()
    expect(() =>
      draw(
        <Chart
          data={[{ name: 'None', value: 0 }]}
          withLabels
          labelsType="percent"
        />
      )
    ).not.toThrow()
  })

  it('forwards the ref and names the root as a group', () => {
    const ref = React.createRef<HTMLDivElement>()
    const container = draw(
      <Chart ref={ref} data={data} aria-label="Visits by source" />
    )
    expect(ref.current).toBe(container.firstElementChild)
    expect(ref.current).toHaveAttribute('role', 'group')
  })

  it('shows the values of a slice with the arrow keys', () => {
    const container = draw(<Chart data={data} />)
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
  })

  it('has no accessibility violations', async () => {
    const container = draw(
      <Chart data={data} aria-label="Visits by source" withLegend />
    )
    const result = await axe.run(container, {
      rules: {
        region: { enabled: false },
        'color-contrast': { enabled: false }
      }
    })
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})

describe('<DonutChart />', () => {
  it('writes the chartLabel in the center', () => {
    const container = draw(<DonutChart data={data} chartLabel="1,000" />)
    expect(container).toHaveTextContent('1,000')
  })

  it('leaves out the center label when there is none', () => {
    expect(draw(<DonutChart data={data} />)).not.toHaveTextContent('1,000')
  })

  it('cuts a hole that a pie does not have', () => {
    const slice = (node: React.ReactElement) =>
      draw(node).querySelector('.recharts-pie-sector path')?.getAttribute('d')
    expect(slice(<DonutChart data={data} />)).not.toBe(
      slice(<PieChart data={data} />)
    )
  })
})
