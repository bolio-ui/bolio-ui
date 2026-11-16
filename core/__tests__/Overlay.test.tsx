import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, LoadingOverlay, Overlay } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('Overlay', () => {
  it('covers the closest positioned parent by default', () => {
    wrap(<Overlay data-testid="o">content</Overlay>)
    const el = screen.getByTestId('o')
    expect(el).toHaveStyle({ position: 'absolute', zIndex: '10' })
    expect(el).toHaveTextContent('content')
  })

  it('covers the screen with fixed and blurs what is behind', () => {
    wrap(<Overlay data-testid="o" fixed blur={4} />)
    const el = screen.getByTestId('o')
    expect(el).toHaveStyle({ position: 'fixed' })
    expect(el.style.backdropFilter).toBe('blur(4px)')
  })

  it('mixes the color with the opacity', () => {
    wrap(<Overlay data-testid="o" color="#000" opacity={0.3} />)
    expect(screen.getByTestId('o').style.backgroundColor).toContain('30%')
  })
})

describe('LoadingOverlay', () => {
  it('announces the loading state', () => {
    wrap(<LoadingOverlay label="Saving" />)
    expect(screen.getByRole('status', { name: 'Saving' })).toBeInTheDocument()
  })

  it('renders nothing while it is not visible', () => {
    wrap(<LoadingOverlay visible={false} />)
    expect(screen.queryByRole('status')).toBeNull()
  })
})
