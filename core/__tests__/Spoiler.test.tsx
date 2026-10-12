import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, Spoiler } from '..'

let contentHeight = 0
let notify: (() => void) | undefined

class FakeResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    notify = () =>
      callback(
        [{ contentRect: { height: contentHeight } } as ResizeObserverEntry],
        this
      )
  }
  observe() {
    notify?.()
  }
  unobserve() {}
  disconnect() {}
}

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('<Spoiler />', () => {
  beforeEach(() => {
    window.ResizeObserver = FakeResizeObserver
  })

  afterEach(() => {
    Reflect.deleteProperty(window, 'ResizeObserver')
  })

  it('has no button when the content fits', () => {
    contentHeight = 50
    wrap(<Spoiler maxHeight={100}>Short</Spoiler>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('clamps the content and opens it with the button', () => {
    contentHeight = 300
    const { container } = wrap(<Spoiler maxHeight={100}>Long</Spoiler>)
    const content = screen.getByText('Long').parentElement as HTMLElement
    expect(content).toHaveStyle({ maxHeight: '100px' })

    const button = screen.getByRole('button', { name: 'Show more' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', content.id)

    fireEvent.click(button)
    expect(content.style.maxHeight).toBe('')
    expect(screen.getByRole('button', { name: 'Hide' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    expect(container.firstElementChild).toHaveClass('spoiler')
  })

  it('keeps the button on an opened spoiler so it can close again', () => {
    contentHeight = 20
    wrap(
      <Spoiler maxHeight={100} initialOpened>
        Long
      </Spoiler>
    )
    expect(screen.getByRole('button', { name: 'Hide' })).toBeInTheDocument()
  })

  it('uses the custom labels', () => {
    contentHeight = 300
    wrap(
      <Spoiler maxHeight={100} showLabel="Read more" hideLabel="Read less">
        Long
      </Spoiler>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Read more' }))
    expect(
      screen.getByRole('button', { name: 'Read less' })
    ).toBeInTheDocument()
  })
})
