import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Skeleton } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('<Skeleton />', () => {
  it('is hidden from assistive technology', () => {
    const { container } = wrap(<Skeleton />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
    expect(root).not.toHaveAttribute('aria-busy')
    expect(root.querySelectorAll('.shape')).toHaveLength(1)
  })

  it('draws one shape per line', () => {
    const { container } = wrap(<Skeleton lines={3} />)
    expect(container.querySelectorAll('.shape')).toHaveLength(3)
  })

  it('draws a single shape for a circle, whatever the lines', () => {
    const { container } = wrap(<Skeleton circle lines={3} />)
    expect(container.firstElementChild).toHaveClass('circle')
    expect(container.querySelectorAll('.shape')).toHaveLength(1)
  })

  it('marks the container busy while its children load', () => {
    const { container, rerender } = wrap(
      <Skeleton loading>
        <p>Loaded text</p>
      </Skeleton>
    )
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('aria-busy', 'true')
    expect(root).not.toHaveAttribute('aria-hidden')
    expect(root.querySelector('.shape')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.queryByText('Loaded text')).not.toBeInTheDocument()

    rerender(
      <BolioUIProvider>
        <Skeleton loading={false}>
          <p>Loaded text</p>
        </Skeleton>
      </BolioUIProvider>
    )
    expect(screen.getByText('Loaded text')).toBeInTheDocument()
    expect(container.querySelector('.shape')).not.toBeInTheDocument()
  })

  it('passes native props to the root', () => {
    const { container } = wrap(<Skeleton data-testid="s" className="extra" />)
    expect(container.firstElementChild).toHaveAttribute('data-testid', 's')
    expect(container.firstElementChild).toHaveClass('skeleton', 'extra')
  })
})
