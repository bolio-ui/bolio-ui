import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, ScrollArea } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

const parts = (container: HTMLElement) => {
  const root = container.firstElementChild as HTMLElement
  return { root, viewport: root.firstElementChild as HTMLElement }
}

describe('<ScrollArea />', () => {
  it('can take focus, so the keyboard can scroll it', () => {
    wrap(<ScrollArea aria-label="Notes">Content</ScrollArea>)
    expect(screen.getByLabelText('Notes')).toHaveAttribute('tabindex', '0')
  })

  it('scrolls on the vertical axis by default', () => {
    const { container } = wrap(<ScrollArea>Content</ScrollArea>)
    expect(parts(container).viewport).toHaveClass('vertical')
  })

  it('follows the orientation', () => {
    const { container } = wrap(
      <ScrollArea orientation="horizontal">Content</ScrollArea>
    )
    expect(parts(container).viewport).toHaveClass('horizontal')
  })

  it('leaves room below a sideways scrollbar, not a vertical one', () => {
    const { container, rerender } = wrap(
      <ScrollArea orientation="horizontal">Content</ScrollArea>
    )
    expect(parts(container).viewport.style.paddingBottom).not.toBe('0')
    rerender(
      <BolioUIProvider>
        <ScrollArea>Content</ScrollArea>
      </BolioUIProvider>
    )
    expect(parts(container).viewport.style.paddingBottom).toBe('0px')
  })

  it('hides the scrollbar until hover with scrollbar="hover"', () => {
    const { container } = wrap(
      <ScrollArea scrollbar="hover">Content</ScrollArea>
    )
    expect(parts(container).root).toHaveClass('hover')
  })

  it('sets the height and keeps the consumer style on the root', () => {
    const { container } = wrap(
      <ScrollArea height="120px" style={{ color: 'red' }}>
        Content
      </ScrollArea>
    )
    const { root } = parts(container)
    expect(root.style.height).toBe('120px')
    expect(root.style.color).toBe('red')
  })

  it('puts className on the root and native props on the scrolling element', () => {
    const { container } = wrap(
      <ScrollArea data-testid="s" className="extra">
        Content
      </ScrollArea>
    )
    const { root, viewport } = parts(container)
    expect(root).toHaveClass('scrollArea', 'extra')
    expect(viewport).toHaveAttribute('data-testid', 's')
  })

  it('scrolls a horizontal area with the vertical wheel until the end', () => {
    const { container } = wrap(
      <ScrollArea orientation="horizontal">Content</ScrollArea>
    )
    const { viewport } = parts(container)
    Object.defineProperty(viewport, 'scrollWidth', { value: 500 })
    Object.defineProperty(viewport, 'clientWidth', { value: 200 })

    expect(fireEvent.wheel(viewport, { deltaY: 120 })).toBe(false)
    expect(viewport.scrollLeft).toBe(120)

    viewport.scrollLeft = 300
    // at the end, the page takes the wheel again
    expect(fireEvent.wheel(viewport, { deltaY: 120 })).toBe(true)
  })

  it('leaves the wheel alone on a vertical area', () => {
    const { container } = wrap(<ScrollArea>Content</ScrollArea>)
    const { viewport } = parts(container)
    Object.defineProperty(viewport, 'scrollWidth', { value: 500 })
    Object.defineProperty(viewport, 'clientWidth', { value: 200 })
    expect(fireEvent.wheel(viewport, { deltaY: 120 })).toBe(true)
  })

  describe('where the browser has no styled scrollbar', () => {
    let supports: jest.SpyInstance

    beforeEach(() => {
      window.CSS = { supports: () => false } as unknown as typeof CSS
      supports = jest.spyOn(window.CSS, 'supports')
      // jsdom has no pointer events, and the drag reads clientX from them
      window.PointerEvent = class extends MouseEvent {
        pointerId = 1
      } as unknown as typeof PointerEvent
      window.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    })

    afterEach(() => {
      supports.mockRestore()
      Reflect.deleteProperty(window, 'ResizeObserver')
      Reflect.deleteProperty(window, 'PointerEvent')
      Reflect.deleteProperty(window, 'CSS')
    })

    const scrollable = (viewport: HTMLElement) => {
      Object.defineProperty(viewport, 'scrollWidth', { value: 1000 })
      Object.defineProperty(viewport, 'clientWidth', { value: 250 })
      fireEvent.scroll(viewport)
    }

    it('hides the native scrollbar and draws a thumb sized to the content', () => {
      const { container } = wrap(
        <ScrollArea orientation="horizontal">Content</ScrollArea>
      )
      const { viewport } = parts(container)
      expect(viewport).toHaveClass('custom')
      scrollable(viewport)
      const thumb = container.querySelector('.thumb') as HTMLElement
      expect(thumb.style.width).toBe('62.5px')
      expect(thumb.style.transform).toBe('translateX(0px)')
    })

    it('moves the thumb with the scroll position', () => {
      const { container } = wrap(
        <ScrollArea orientation="horizontal">Content</ScrollArea>
      )
      const { viewport } = parts(container)
      viewport.scrollLeft = 750
      scrollable(viewport)
      const thumb = container.querySelector('.thumb') as HTMLElement
      expect(thumb.style.transform).toBe('translateX(187.5px)')
    })

    it('scrolls the content when the thumb is dragged', () => {
      const { container } = wrap(
        <ScrollArea orientation="horizontal">Content</ScrollArea>
      )
      const { viewport } = parts(container)
      scrollable(viewport)
      const thumb = container.querySelector('.thumb') as HTMLElement
      thumb.setPointerCapture = jest.fn()
      fireEvent.pointerDown(thumb, { clientX: 10, pointerId: 1 })
      fireEvent.pointerMove(thumb, { clientX: 70, pointerId: 1 })
      // 60px of thumb travel is 60 * (1000 - 250) / (250 - 62.5) = 240px
      expect(viewport.scrollLeft).toBe(240)
      fireEvent.pointerUp(thumb, { pointerId: 1 })
      fireEvent.pointerMove(thumb, { clientX: 200, pointerId: 1 })
      expect(viewport.scrollLeft).toBe(240)
    })

    it('draws no thumb when the content fits', () => {
      const { container } = wrap(
        <ScrollArea orientation="horizontal">Content</ScrollArea>
      )
      expect(container.querySelector('.thumb')).not.toBeInTheDocument()
    })
  })
})
