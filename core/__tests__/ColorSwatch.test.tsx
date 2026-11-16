import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, ColorSwatch } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('ColorSwatch', () => {
  it('shows the color and is named after it', () => {
    wrap(<ColorSwatch color="#ff0000" />)
    const el = screen.getByRole('img', { name: '#ff0000' })
    expect(el.style.getPropertyValue('--swatch-color')).toBe('#ff0000')
  })

  it('takes a custom label', () => {
    wrap(<ColorSwatch color="#ff0000" label="Brand red" />)
    expect(screen.getByRole('img', { name: 'Brand red' })).toBeInTheDocument()
  })

  it('scales with the scale props', () => {
    wrap(
      <>
        <ColorSwatch color="#000" label="small" />
        <ColorSwatch color="#000" label="big" scale={2} />
      </>
    )
    expect(screen.getByRole('img', { name: 'big' }).style.width).not.toBe(
      screen.getByRole('img', { name: 'small' }).style.width
    )
  })
})
