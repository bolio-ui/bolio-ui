import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider } from '..'
import { RadarChart, ScatterChart } from '../Charts'

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

const skills = [
  { skill: 'Speed', anna: 80, ben: 60 },
  { skill: 'Power', anna: 50, ben: 90 },
  { skill: 'Skill', anna: 70, ben: 70 },
  { skill: 'Defense', anna: 40, ben: 55 }
]
const players = [
  { name: 'anna', label: 'Anna' },
  { name: 'ben', label: 'Ben', color: '#8b5cf6' }
]

describe('<RadarChart />', () => {
  const props = { data: skills, dataKey: 'skill', series: players }

  it('draws one polygon per series', () => {
    expect(
      draw(<RadarChart {...props} />).querySelectorAll('.recharts-radar')
    ).toHaveLength(2)
  })

  it('names each axis with the data key', () => {
    const labels = Array.from(
      draw(<RadarChart {...props} />).querySelectorAll(
        '.recharts-polar-angle-axis-tick-value'
      )
    ).map((tick) => tick.textContent)
    expect(labels).toEqual(['Speed', 'Power', 'Skill', 'Defense'])
  })

  it('hides the grid and the axis on request', () => {
    const container = draw(
      <RadarChart {...props} withPolarGrid={false} withPolarAngleAxis={false} />
    )
    expect(container.querySelector('.recharts-polar-grid')).toBeNull()
    expect(container.querySelector('.recharts-polar-angle-axis')).toBeNull()
  })

  it('shows the radius axis only when asked', () => {
    expect(
      draw(<RadarChart {...props} />).querySelector(
        '.recharts-polar-radius-axis'
      )
    ).toBeNull()
    expect(
      draw(<RadarChart {...props} withPolarRadiusAxis />).querySelector(
        '.recharts-polar-radius-axis'
      )
    ).not.toBeNull()
  })

  it('shows the legend in the order of the series', () => {
    const labels = Array.from(
      draw(<RadarChart {...props} withLegend />).querySelectorAll(
        '.recharts-legend-item-text'
      )
    ).map((item) => item.textContent)
    expect(labels).toEqual(['Anna', 'Ben'])
  })

  it('uses the color of a series', () => {
    expect(draw(<RadarChart {...props} />).innerHTML.toLowerCase()).toContain(
      '#8b5cf6'
    )
  })

  it('names the root as a group and has no violations', async () => {
    const container = draw(<RadarChart {...props} aria-label="Skills" />)
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    const result = await axe.run(container, {
      rules: {
        region: { enabled: false },
        'color-contrast': { enabled: false }
      }
    })
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})

describe('<ScatterChart />', () => {
  const data = [
    {
      name: 'group-a',
      label: 'Group A',
      points: [
        { x: 10, y: 30 },
        { x: 20, y: 50 },
        { x: 30, y: 40 }
      ]
    },
    { name: 'group-b', color: '#8b5cf6', points: [{ x: 15, y: 20 }] }
  ]

  it('draws one scatter per series and one dot per point', () => {
    const container = draw(<ScatterChart data={data} />)
    expect(container.querySelectorAll('.recharts-scatter')).toHaveLength(2)
    expect(container.querySelectorAll('.recharts-symbols')).toHaveLength(4)
  })

  it('writes the axis titles', () => {
    const container = draw(
      <ScatterChart data={data} xAxisLabel="Age" yAxisLabel="Weight" />
    )
    const text = container.textContent
    expect(text).toContain('Age')
    expect(text).toContain('Weight')
  })

  it('formats the axis ticks with valueFormatter', () => {
    const container = draw(
      <ScatterChart data={data} valueFormatter={(v) => `${v}u`} />
    )
    const ticks = Array.from(
      container.querySelectorAll('.recharts-cartesian-axis-tick-value')
    ).map((tick) => tick.textContent)
    expect(ticks.length).toBeGreaterThan(0)
    ticks.forEach((text) => expect(text).toMatch(/u$/))
  })

  it('hides axes and grid on request', () => {
    const container = draw(
      <ScatterChart
        data={data}
        withXAxis={false}
        withYAxis={false}
        withGrid={false}
      />
    )
    expect(container.querySelector('.recharts-xAxis')).toBeNull()
    expect(container.querySelector('.recharts-yAxis')).toBeNull()
    expect(container.querySelector('.recharts-cartesian-grid')).toBeNull()
  })

  it('shows the legend in the order of the series', () => {
    const labels = Array.from(
      draw(<ScatterChart data={data} withLegend />).querySelectorAll(
        '.recharts-legend-item-text'
      )
    ).map((item) => item.textContent)
    expect(labels).toEqual(['Group A', 'group-b'])
  })

  it('shows the values of a point with the arrow keys', () => {
    const container = draw(<ScatterChart data={data} />)
    const surface = container.querySelector(
      'svg.recharts-surface'
    ) as SVGElement
    const tooltip = container.querySelector(
      '.recharts-tooltip-wrapper'
    ) as HTMLElement
    surface.focus()
    fireEvent.keyDown(surface, { key: 'ArrowRight' })
    expect(tooltip.style.visibility).toBe('visible')
  })

  it('names the root as a group and has no violations', async () => {
    const container = draw(
      <ScatterChart data={data} aria-label="Weight by age" />
    )
    expect(container.firstElementChild).toHaveAttribute('role', 'group')
    const result = await axe.run(container, {
      rules: {
        region: { enabled: false },
        'color-contrast': { enabled: false }
      }
    })
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})
