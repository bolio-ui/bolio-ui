import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  BolioUIProvider,
  BulletChart,
  MatrixChart,
  SunburstChart,
  WaffleChart
} from '..'

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>).container

describe('<SunburstChart />', () => {
  const data = [
    {
      name: 'Fruit',
      color: '#16a34a',
      children: [
        { name: 'Apple', value: 30 },
        { name: 'Pear', value: 20 }
      ]
    },
    { name: 'Veg', value: 50 }
  ]
  const paths = (c: HTMLElement) => Array.from(c.querySelectorAll('path'))

  it('draws an arc for every node, parents and leaves', () => {
    expect(paths(draw(<SunburstChart data={data} />))).toHaveLength(4)
  })

  it('names each arc with its value, and a parent adds its children', () => {
    const titles = Array.from(
      draw(<SunburstChart data={data} />).querySelectorAll('title')
    ).map((title) => title.textContent)
    expect(titles).toEqual(['Fruit: 50', 'Apple: 30', 'Pear: 20', 'Veg: 50'])
  })

  it('gives the children the color of their parent, lighter', () => {
    const [parent, child] = paths(draw(<SunburstChart data={data} />))
    expect(child.getAttribute('fill')).toBe(parent.getAttribute('fill'))
    expect(Number(child.getAttribute('fill-opacity'))).toBeLessThan(
      Number(parent.getAttribute('fill-opacity'))
    )
  })

  it('splits the circle by value', () => {
    // Fruit and Veg are both 50 of 100, so both take half the circle
    const container = draw(<SunburstChart data={data} />)
    const [fruit, , , veg] = paths(container)
    expect(fruit.getAttribute('d')).not.toBe(veg.getAttribute('d'))
    expect(fruit.getAttribute('d')).toMatch(/A.*0 0 1/)
  })

  it('writes names only when asked, and only where they fit', () => {
    expect(
      draw(<SunburstChart data={data} />).querySelectorAll('text')
    ).toHaveLength(0)
    const texts = Array.from(
      draw(
        <SunburstChart data={data} withLabels size={420} />
      ).querySelectorAll('text')
    ).map((t) => t.textContent)
    expect(texts).toEqual(expect.arrayContaining(['Fruit', 'Veg']))
  })

  it('uses the color of an item and valueFormatter', () => {
    const container = draw(
      <SunburstChart
        data={[{ name: 'A', value: 5, color: '#8b5cf6' }]}
        valueFormatter={(v) => `${v} kg`}
      />
    )
    expect(container.querySelector('path')).toHaveAttribute('fill', '#8b5cf6')
    expect(container.querySelector('title')?.textContent).toBe('A: 5 kg')
  })

  it('draws a single full circle without collapsing it, and ignores empty data', () => {
    const one = draw(<SunburstChart data={[{ name: 'All', value: 1 }]} />)
    expect(paths(one)[0].getAttribute('d')).not.toMatch(/NaN/)
    expect(paths(draw(<SunburstChart data={[]} />))).toHaveLength(0)
    expect(
      paths(draw(<SunburstChart data={[{ name: 'Zero', value: 0 }]} />))
    ).toHaveLength(0)
  })

  it('is an image when it has a name, and hidden otherwise', () => {
    expect(
      draw(<SunburstChart data={data} />).querySelector('svg')
    ).toHaveAttribute('aria-hidden', 'true')
    draw(<SunburstChart data={data} aria-label="Share by group" />)
    expect(
      screen.getByRole('img', { name: 'Share by group' })
    ).toBeInTheDocument()
  })
})

describe('<WaffleChart />', () => {
  const data = [
    { name: 'Chrome', value: 65, color: '#16a34a' },
    { name: 'Safari', value: 25, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#dc2626' }
  ]
  const count = (c: HTMLElement, color: string) =>
    Array.from(c.querySelectorAll('rect')).filter(
      (r) => r.getAttribute('fill') === color
    ).length

  it('draws rows by columns cells', () => {
    expect(
      draw(<WaffleChart data={data} />).querySelectorAll('rect')
    ).toHaveLength(100)
    expect(
      draw(<WaffleChart data={data} rows={5} columns={8} />).querySelectorAll(
        'rect'
      )
    ).toHaveLength(40)
  })

  it('gives each segment cells in proportion to its value', () => {
    const container = draw(<WaffleChart data={data} />)
    expect(count(container, '#16a34a')).toBe(65)
    expect(count(container, '#f59e0b')).toBe(25)
    expect(count(container, '#dc2626')).toBe(10)
  })

  it('always adds up to the grid, even when the shares do not divide', () => {
    const odd = [
      { name: 'A', value: 1, color: '#111111' },
      { name: 'B', value: 1, color: '#222222' },
      { name: 'C', value: 1, color: '#333333' }
    ]
    const container = draw(<WaffleChart data={odd} />)
    const filled = ['#111111', '#222222', '#333333'].map((c) =>
      count(container, c)
    )
    expect(filled.reduce((a, b) => a + b, 0)).toBe(100)
    filled.forEach((n) => expect(n).toBeGreaterThanOrEqual(33))
  })

  it('leaves cells empty when the total is bigger than the values', () => {
    const container = draw(
      <WaffleChart
        data={[{ name: 'Done', value: 25, color: '#16a34a' }]}
        total={100}
        emptyColor="#eeeeee"
      />
    )
    expect(count(container, '#16a34a')).toBe(25)
    expect(count(container, '#eeeeee')).toBe(75)
  })

  it('does not draw more than the grid when the values pass the total', () => {
    const container = draw(
      <WaffleChart
        data={[{ name: 'Over', value: 500, color: '#16a34a' }]}
        total={100}
      />
    )
    expect(count(container, '#16a34a')).toBe(100)
  })

  it('starts filling where the direction says', () => {
    const first = (
      direction: React.ComponentProps<typeof WaffleChart>['fillDirection']
    ) => {
      const rects = Array.from(
        draw(
          <WaffleChart
            data={[{ name: 'A', value: 1, color: '#16a34a' }]}
            total={100}
            fillDirection={direction}
            emptyColor="#eeeeee"
          />
        ).querySelectorAll('rect')
      )
      const index = rects.findIndex((r) => r.getAttribute('fill') === '#16a34a')
      return [index % 10, Math.floor(index / 10)]
    }
    expect(first('left-to-right')).toEqual([0, 0])
    expect(first('right-to-left')).toEqual([9, 0])
    expect(first('top-to-bottom')).toEqual([0, 0])
    expect(first('bottom-to-top')).toEqual([0, 9])
  })

  it('names the cells and lists the segments in a legend', () => {
    const container = draw(
      <WaffleChart data={data} valueFormatter={(v) => `${v}%`} />
    )
    expect(container.querySelector('title')?.textContent).toBe('Chrome: 65%')
    const items = screen.getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual(['Chrome65%', 'Safari25%', 'Other10%'])
  })

  it('describes the grid itself when there is no legend', () => {
    draw(<WaffleChart data={data} withLegend={false} />)
    expect(screen.getByRole('img')).toHaveAccessibleName(
      'Chrome 65, Safari 25, Other 10'
    )
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('names the root as a group', () => {
    draw(<WaffleChart data={data} aria-label="Browser share" />)
    expect(
      screen.getByRole('group', { name: 'Browser share' })
    ).toBeInTheDocument()
  })

  it('does not break with no data', () => {
    expect(() => draw(<WaffleChart data={[]} />)).not.toThrow()
  })
})

describe('<BulletChart />', () => {
  const ranges = [
    { value: 150, label: 'Poor', color: '#fca5a5' },
    { value: 225, label: 'Fair', color: '#fde68a' },
    { value: 300, label: 'Good', color: '#86efac' }
  ]
  const boxes = (c: HTMLElement) =>
    Array.from(
      c.querySelectorAll<HTMLElement>('div[style*="position: absolute"]')
    )

  it('is a meter with its range when it has a name', () => {
    draw(
      <BulletChart
        aria-label="Revenue"
        value={270}
        target={250}
        ranges={ranges}
      />
    )
    const meter = screen.getByRole('meter', { name: 'Revenue' })
    expect(meter).toHaveAttribute('aria-valuenow', '270')
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '300')
    expect(meter).toHaveAttribute('aria-valuetext', '270, target 250')
  })

  it('is not a meter without a name', () => {
    draw(<BulletChart value={270} ranges={ranges} />)
    expect(screen.queryByRole('meter')).toBeNull()
  })

  it('sizes the bands, the bar and the target as shares of the range', () => {
    const items = boxes(
      draw(<BulletChart value={150} target={240} ranges={ranges} />)
    )
    // three bands, the bar, the target
    expect(items).toHaveLength(5)
    expect(items[0].style.width).toBe('50%')
    expect(items[1].style.width).toBe('25%')
    expect(items[2].style.width).toBe('25%')
    expect(items[3].style.width).toBe('50%')
    expect(items[4].style.left).toBe('80%')
  })

  it('uses the color of a range', () => {
    const items = boxes(draw(<BulletChart value={100} ranges={ranges} />))
    expect(items[0].style.background).toBe('rgb(252, 165, 165)')
  })

  it('draws no target marker without a target', () => {
    expect(
      boxes(draw(<BulletChart value={100} ranges={ranges} />))
    ).toHaveLength(4)
  })

  it('stands the bar up in the vertical layout', () => {
    const items = boxes(
      draw(<BulletChart orientation="vertical" value={150} ranges={ranges} />)
    )
    expect(items[0].style.height).toBe('50%')
    expect(items[3].style.height).toBe('50%')
  })

  it('lists the range labels', () => {
    draw(<BulletChart value={100} ranges={ranges} />)
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(
      ['Poor', 'Fair', 'Good']
    )
  })

  it('writes a label and does not break with nothing to size', () => {
    expect(
      draw(<BulletChart value={5} ranges={[]} label="Sales" />)
    ).toHaveTextContent('Sales')
    expect(draw(<BulletChart value={0} ranges={[]} />).innerHTML).not.toMatch(
      /NaN|Infinity/
    )
  })
})

describe('<MatrixChart />', () => {
  const data = [
    { x: 'Mon', y: 'api', value: 2 },
    { x: 'Tue', y: 'api', value: 8 },
    { x: 'Mon', y: 'web', value: null },
    { x: 'Tue', y: 'web', value: 4 }
  ]
  const cell = (c: HTMLElement, text: string) =>
    Array.from(c.querySelectorAll('rect')).find((r) =>
      r.querySelector('title')?.textContent?.startsWith(text)
    ) as SVGRectElement

  it('draws a cell for every column and row, even without data', () => {
    const lonely = [
      { x: 'a', y: 'one', value: 1 },
      { x: 'b', y: 'two', value: 2 }
    ]
    expect(
      draw(<MatrixChart data={lonely} />).querySelectorAll('rect')
    ).toHaveLength(4)
  })

  it('names the columns and the rows', () => {
    const texts = Array.from(
      draw(<MatrixChart data={data} />).querySelectorAll('text')
    ).map((t) => t.textContent)
    expect(texts).toEqual(expect.arrayContaining(['Mon', 'Tue', 'api', 'web']))
  })

  it('hides the labels on request', () => {
    expect(
      draw(
        <MatrixChart data={data} withXLabels={false} withYLabels={false} />
      ).querySelectorAll('text')
    ).toHaveLength(0)
  })

  it('colors by value, and leaves a null cell empty', () => {
    const container = draw(<MatrixChart data={data} />)
    const fill = (text: string) => cell(container, text).style.fill
    expect(fill('api, Mon')).not.toBe(fill('api, Tue'))
    expect(
      new Set([fill('api, Mon'), fill('api, Tue'), fill('web, Mon')]).size
    ).toBe(3)
  })

  it('names each cell, and says when it has no value', () => {
    const container = draw(<MatrixChart data={data} />)
    expect(
      cell(container, 'api, Tue').querySelector('title')?.textContent
    ).toBe('api, Tue: 8')
    expect(
      cell(container, 'web, Mon').querySelector('title')?.textContent
    ).toBe('web, Mon: no value')
  })

  it('uses valueLabel and the colors it is given', () => {
    const container = draw(
      <MatrixChart
        data={data}
        colors={['#111111', '#999999']}
        valueLabel={(c) => `${c.value} deploys`}
      />
    )
    expect(cell(container, '8 deploys').style.fill).toBe('#999999')
    expect(cell(container, '2 deploys').style.fill).toBe('#111111')
  })

  it('takes the domain it is given', () => {
    const wide = draw(
      <MatrixChart
        data={data}
        domain={[0.5, 100]}
        colors={['#111111', '#999999']}
      />
    )
    expect(cell(wide, 'api, Tue').style.fill).toBe('#111111')
  })

  it('shows a legend only when asked', () => {
    expect(
      Array.from(
        draw(<MatrixChart data={data} />).querySelectorAll('text')
      ).some((t) => t.textContent === 'Less')
    ).toBe(false)
    const texts = Array.from(
      draw(<MatrixChart data={data} withLegend />).querySelectorAll('text')
    ).map((t) => t.textContent)
    expect(texts).toEqual(expect.arrayContaining(['Less', 'More']))
  })

  it('does not break with no data', () => {
    expect(draw(<MatrixChart data={[]} />).innerHTML).not.toMatch(
      /NaN|Infinity/
    )
  })

  it('is an image when it has a name, and hidden otherwise', () => {
    expect(
      draw(<MatrixChart data={data} />).querySelector('svg')
    ).toHaveAttribute('aria-hidden', 'true')
    draw(
      <MatrixChart data={data} aria-label="Deploys per service and weekday" />
    )
    expect(
      screen.getByRole('img', { name: 'Deploys per service and weekday' })
    ).toBeInTheDocument()
  })
})
