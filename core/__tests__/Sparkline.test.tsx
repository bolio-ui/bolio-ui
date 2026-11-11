import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Sparkline } from '..'

const draw = (props: Partial<React.ComponentProps<typeof Sparkline>> = {}) => {
  const { container } = render(
    <BolioUIProvider>
      <Sparkline data={[1, 3, 2, 5]} {...props} />
    </BolioUIProvider>
  )
  return container.querySelector('svg') as SVGSVGElement
}

const lines = (svg: SVGSVGElement) =>
  Array.from(svg.querySelectorAll('path')).filter(
    (path) => path.getAttribute('stroke-width') !== null
  )

describe('<Sparkline />', () => {
  it('is hidden from screen readers until it has a name', () => {
    const svg = draw()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
  })

  it('is an image when it has a name', () => {
    draw({ 'aria-label': 'Visits, rising' })
    expect(
      screen.getByRole('img', { name: 'Visits, rising' })
    ).toBeInTheDocument()
  })

  it('draws one line and one area', () => {
    const svg = draw()
    expect(lines(svg)).toHaveLength(1)
    expect(svg.querySelectorAll('path')).toHaveLength(2)
    expect(lines(draw({ area: false }))).toHaveLength(1)
  })

  it('leaves out the area when asked', () => {
    expect(draw({ area: false }).querySelectorAll('path')).toHaveLength(1)
  })

  it('breaks the line at null values unless they are connected', () => {
    const data = [3, 5, null, 8, 6]
    expect(lines(draw({ data }))).toHaveLength(2)
    expect(lines(draw({ data, connectNulls: true }))).toHaveLength(1)
  })

  it('never produces NaN, even for flat, single or empty data', () => {
    ;[[4, 4, 4], [7], [], [null, null]].forEach((data) => {
      const svg = draw({ data })
      svg.querySelectorAll('path').forEach((path) => {
        expect(path.getAttribute('d')).not.toMatch(/NaN|Infinity/)
      })
    })
  })

  it('colors the trend, unless a color is given', () => {
    const rising = draw({ trend: true, data: [1, 5] }).style.color
    const falling = draw({ trend: true, data: [5, 1] }).style.color
    expect(rising).not.toBe(falling)
    expect(draw({ trend: true, data: [1, 5], color: 'red' }).style.color).toBe(
      'red'
    )
  })
})
