import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Splitter } from '..'

// jsdom has no PointerEvent, and without it the position of the pointer is lost
beforeAll(() => {
  class PointerEventMock extends MouseEvent {
    pointerId: number
    constructor(
      type: string,
      init: MouseEventInit & { pointerId?: number } = {}
    ) {
      super(type, init)
      this.pointerId = init.pointerId ?? 0
    }
  }
  Object.assign(window, { PointerEvent: PointerEventMock })
})

type Props = Partial<React.ComponentProps<typeof Splitter>>
const setup = (props: Props = {}) =>
  render(
    <BolioUIProvider>
      <Splitter aria-label="Layout" {...props}>
        <Splitter.Panel defaultSize={30} minSize={15} maxSize={60}>
          Sidebar
        </Splitter.Panel>
        <Splitter.Panel>Content</Splitter.Panel>
      </Splitter>
    </BolioUIProvider>
  )

// the size of every panel, from the tracks of the grid
const sizes = (name: string) =>
  [
    ...(
      (
        screen.getByText(name).parentElement as HTMLElement
      ).style.getPropertyValue('--splitter-template') as string
    ).matchAll(/minmax\(0, ([\d.]+)fr\)/g)
  ].map((match) => Number(match[1]))
const grow = (name: string) => {
  const index = Array.from(
    (screen.getByText(name).parentElement as HTMLElement).children
  )
    .filter((child) => child.getAttribute('role') !== 'separator')
    .indexOf(screen.getByText(name))
  return String(sizes(name)[index])
}
const handle = () => screen.getByRole('separator')

describe('<Splitter />', () => {
  it('shares the room: the given size, and the rest among the others', () => {
    setup()
    expect(grow('Sidebar')).toBe('30')
    expect(grow('Content')).toBe('70')
  })

  it('splits what is left equally among the panels without a size', () => {
    render(
      <BolioUIProvider>
        <Splitter>
          <Splitter.Panel defaultSize={20}>A</Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
          <Splitter.Panel>C</Splitter.Panel>
        </Splitter>
      </BolioUIProvider>
    )
    expect([grow('A'), grow('B'), grow('C')]).toEqual(['20', '40', '40'])
    expect(screen.getAllByRole('separator')).toHaveLength(2)
  })

  it('has a separator that says what it controls and the limits it has', () => {
    setup()
    expect(handle()).toHaveAttribute('aria-orientation', 'vertical')
    expect(handle()).toHaveAttribute('aria-valuenow', '30')
    expect(handle()).toHaveAttribute('aria-valuemin', '15')
    expect(handle()).toHaveAttribute('aria-valuemax', '60')
    expect(handle()).toHaveAttribute(
      'aria-controls',
      screen.getByText('Sidebar').id
    )
    expect(handle()).toHaveAccessibleName('Resize')
  })

  it('moves with the arrows, and Shift in bigger steps', () => {
    const onResize = jest.fn()
    setup({ onResize })
    fireEvent.keyDown(handle(), { key: 'ArrowRight' })
    expect(grow('Sidebar')).toBe('31')
    expect(grow('Content')).toBe('69')
    fireEvent.keyDown(handle(), { key: 'ArrowLeft', shiftKey: true })
    expect(grow('Sidebar')).toBe('21')
    expect(onResize).toHaveBeenLastCalledWith([21, 79])
  })

  it('goes to the limits with Home and End', () => {
    setup()
    fireEvent.keyDown(handle(), { key: 'End' })
    expect(grow('Sidebar')).toBe('60')
    expect(handle()).toHaveAttribute('aria-valuenow', '60')
    fireEvent.keyDown(handle(), { key: 'Home' })
    expect(grow('Sidebar')).toBe('15')
  })

  it('does not go past the limit of either panel', () => {
    const onResize = jest.fn()
    setup({ onResize })
    fireEvent.keyDown(handle(), { key: 'ArrowLeft', shiftKey: true })
    fireEvent.keyDown(handle(), { key: 'ArrowLeft', shiftKey: true })
    fireEvent.keyDown(handle(), { key: 'ArrowLeft', shiftKey: true })
    expect(grow('Sidebar')).toBe('15')
    const calls = onResize.mock.calls.length
    fireEvent.keyDown(handle(), { key: 'ArrowLeft' })
    expect(onResize).toHaveBeenCalledTimes(calls)
  })

  it('uses the up and down arrows when the panels are stacked', () => {
    setup({ direction: 'vertical' })
    expect(handle()).toHaveAttribute('aria-orientation', 'horizontal')
    fireEvent.keyDown(handle(), { key: 'ArrowRight' })
    expect(grow('Sidebar')).toBe('30')
    fireEvent.keyDown(handle(), { key: 'ArrowDown' })
    expect(grow('Sidebar')).toBe('31')
  })

  describe('with the pointer', () => {
    // each panel is 400px wide, so the panels share 800px
    beforeEach(() => {
      jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(
        () =>
          ({
            width: 400,
            height: 300,
            left: 0,
            top: 0,
            right: 400,
            bottom: 300
          }) as DOMRect
      )
      let captured = false
      Object.assign(HTMLElement.prototype, {
        setPointerCapture: () => (captured = true),
        hasPointerCapture: () => captured,
        releasePointerCapture: () => (captured = false)
      })
    })
    afterEach(() => jest.restoreAllMocks())

    it('drags the line, in percent of the room', () => {
      const onResize = jest.fn()
      setup({ onResize })
      fireEvent.pointerDown(handle(), { clientX: 100, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 180, pointerId: 1 })
      expect(grow('Sidebar')).toBe('40')
      expect(grow('Content')).toBe('60')
      expect(onResize).toHaveBeenLastCalledWith([40, 60])
    })

    it('measures from where the drag began, not from the last move', () => {
      setup()
      fireEvent.pointerDown(handle(), { clientX: 100, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 180, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 140, pointerId: 1 })
      expect(grow('Sidebar')).toBe('35')
    })

    it('stops at the limits however far it is dragged', () => {
      setup()
      fireEvent.pointerDown(handle(), { clientX: 100, pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 5000, pointerId: 1 })
      expect(grow('Sidebar')).toBe('60')
      fireEvent.pointerMove(handle(), { clientX: -5000, pointerId: 1 })
      expect(grow('Sidebar')).toBe('15')
    })

    it('stops following the pointer when it is released', () => {
      setup()
      fireEvent.pointerDown(handle(), { clientX: 100, pointerId: 1 })
      fireEvent.pointerUp(handle(), { pointerId: 1 })
      fireEvent.pointerMove(handle(), { clientX: 300, pointerId: 1 })
      expect(grow('Sidebar')).toBe('30')
    })
  })

  it('starts the sizes again when a panel comes', () => {
    const { rerender } = setup()
    fireEvent.keyDown(handle(), { key: 'ArrowRight', shiftKey: true })
    rerender(
      <BolioUIProvider>
        <Splitter aria-label="Layout">
          <Splitter.Panel defaultSize={30}>Sidebar</Splitter.Panel>
          <Splitter.Panel>Content</Splitter.Panel>
          <Splitter.Panel>More</Splitter.Panel>
        </Splitter>
      </BolioUIProvider>
    )
    expect(grow('Sidebar')).toBe('30')
    expect(screen.getAllByRole('separator')).toHaveLength(2)
  })

  it('passes the props of a panel to its element', () => {
    render(
      <BolioUIProvider>
        <Splitter>
          <Splitter.Panel
            className="mine"
            data-testid="a"
            style={{ padding: 4 }}
          >
            A
          </Splitter.Panel>
          <Splitter.Panel>B</Splitter.Panel>
        </Splitter>
      </BolioUIProvider>
    )
    expect(screen.getByTestId('a')).toHaveClass('mine')
    expect(screen.getByTestId('a').style.padding).toBe('4px')
  })

  it('has no accessibility violations', async () => {
    const { container } = setup()
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
