import React from 'react'
import { render, within } from '@testing-library/react'
import { BolioUIProvider, OverflowList } from '..'

const items = ['one', 'two', 'three', 'four', 'five']

// jsdom has no layout: items are 50px, the overflow 30px, the list `width`.
const layout = (width: number) =>
  jest
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: Element) {
      const size = this.hasAttribute('data-item')
        ? 50
        : this.hasAttribute('data-overflow')
          ? 30
          : width
      return { width: size } as DOMRect
    })

const draw = (width: number, data = items) => {
  layout(width)
  const { container } = render(
    <BolioUIProvider>
      <OverflowList
        data={data}
        renderItem={(item) => <b>{item}</b>}
        renderOverflow={(hidden) => <i>+{hidden.length}</i>}
      />
    </BolioUIProvider>
  )
  // the probe inside the list is hidden
  const list = container.firstElementChild as HTMLElement
  const visible = Array.from(list.children).filter(
    (child) => !child.hasAttribute('aria-hidden')
  )
  return { list, visible, texts: visible.map((child) => child.textContent) }
}

afterEach(() => jest.restoreAllMocks())

describe('<OverflowList />', () => {
  it('shows every item when they fit', () => {
    const { texts } = draw(400)
    expect(texts).toEqual(items)
  })

  it('shows what fits next to the overflow, and counts the rest', () => {
    // 30 overflow + (8 + 50) per item: two items fit in 160
    const { texts } = draw(160)
    expect(texts).toEqual(['one', 'two', '+3'])
  })

  it('shows only the overflow when not even one item fits', () => {
    const { texts } = draw(60)
    expect(texts).toEqual(['+5'])
  })

  it('keeps the measuring copy out of reach of the keyboard and readers', () => {
    const { list } = draw(160)
    const probe = list.querySelector('[aria-hidden="true"]') as HTMLElement
    expect(probe.inert).toBe(true)
    expect(within(list).getAllByText('one')).toHaveLength(2)
  })

  it('forwards the ref to the list', () => {
    layout(400)
    const ref = React.createRef<HTMLDivElement>()
    render(
      <BolioUIProvider>
        <OverflowList
          ref={ref}
          data={['a']}
          renderItem={(item) => <b>{item}</b>}
          renderOverflow={() => null}
        />
      </BolioUIProvider>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
