import React from 'react'
import { render } from '@testing-library/react'
import { BolioUIProvider, CssBaseline } from '..'

const styles = (themeType: string) => {
  const { container } = render(
    <BolioUIProvider themeType={themeType}>
      <CssBaseline />
    </BolioUIProvider>
  )
  return container.ownerDocument.querySelector('style')?.textContent ?? ''
}

describe('<CssBaseline />', () => {
  it('tells the browser which theme the page has, so native controls follow it', () => {
    expect(styles('dark')).toContain('color-scheme: dark')
  })

  it('follows a light theme too', () => {
    expect(styles('light')).toContain('color-scheme: light')
  })

  it('sets border-box on the page', () => {
    expect(styles('light')).toContain('box-sizing: border-box')
  })

  it('keeps every rule in the BolioUIBaseline layer, below the components', () => {
    const css = styles('light').trim()
    expect(css.startsWith('@layer BolioUIBaseline {')).toBe(true)
    expect(css.endsWith('}')).toBe(true)
    // the braces match, so no rule is left outside the layer
    expect(css.split('{').length).toBe(css.split('}').length)
  })
})
