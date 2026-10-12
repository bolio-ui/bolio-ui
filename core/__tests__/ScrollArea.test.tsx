import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, ScrollArea } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('<ScrollArea />', () => {
  it('can take focus, so the keyboard can scroll it', () => {
    wrap(<ScrollArea aria-label="Notes">Content</ScrollArea>)
    expect(screen.getByLabelText('Notes')).toHaveAttribute('tabindex', '0')
  })

  it('scrolls on the vertical axis by default', () => {
    const { container } = wrap(<ScrollArea>Content</ScrollArea>)
    expect(container.firstElementChild).toHaveClass('vertical')
  })

  it('follows the orientation', () => {
    const { container } = wrap(
      <ScrollArea orientation="horizontal">Content</ScrollArea>
    )
    expect(container.firstElementChild).toHaveClass('horizontal')
  })

  it('leaves room below a sideways scrollbar, not a vertical one', () => {
    const { container, rerender } = wrap(
      <ScrollArea orientation="horizontal">Content</ScrollArea>
    )
    const root = () => container.firstElementChild as HTMLElement
    expect(root().style.paddingBottom).not.toBe('0')
    rerender(
      <BolioUIProvider>
        <ScrollArea>Content</ScrollArea>
      </BolioUIProvider>
    )
    expect(root().style.paddingBottom).toBe('0px')
  })

  it('hides the scrollbar until hover with scrollbar="hover"', () => {
    const { container } = wrap(
      <ScrollArea scrollbar="hover">Content</ScrollArea>
    )
    expect(container.firstElementChild).toHaveClass('hover')
  })

  it('sets the height and keeps the consumer style', () => {
    const { container } = wrap(
      <ScrollArea height="120px" style={{ color: 'red' }}>
        Content
      </ScrollArea>
    )
    const root = container.firstElementChild as HTMLElement
    expect(root.style.height).toBe('120px')
    expect(root.style.color).toBe('red')
  })

  it('passes native props and className to the root', () => {
    const { container } = wrap(
      <ScrollArea data-testid="s" className="extra">
        Content
      </ScrollArea>
    )
    expect(container.firstElementChild).toHaveAttribute('data-testid', 's')
    expect(container.firstElementChild).toHaveClass('scrollArea', 'extra')
  })
})
