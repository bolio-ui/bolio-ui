import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Themes, useTheme } from '..'

const custom = Themes.createFromDark({
  type: 'custom-dark',
  palette: { background: '#0f0d23' }
})

describe('ThemeProvider', () => {
  it('uses a custom theme from the very first render', () => {
    const seen: string[] = []
    const Probe = () => {
      seen.push(useTheme().type)
      return null
    }

    render(
      <BolioUIProvider themeType="custom-dark" themes={[custom]}>
        <Probe />
      </BolioUIProvider>
    )

    // it used to render 'light' first (the preset fallback), then the custom
    expect(seen.length).toBeGreaterThan(0)
    expect(seen.every((type) => type === 'custom-dark')).toBe(true)
  })

  it('falls back to the preset for an unknown theme type', () => {
    const Probe = () => <span data-testid="type">{useTheme().type}</span>

    render(
      <BolioUIProvider themeType="missing" themes={[custom]}>
        <Probe />
      </BolioUIProvider>
    )

    expect(screen.getByTestId('type').textContent).toBe('light')
  })

  it('switches between custom themes without a preset in between', () => {
    const other = Themes.createFromLight({
      type: 'custom-light',
      palette: { background: '#fff' }
    })
    const seen: string[] = []
    const Probe = () => {
      seen.push(useTheme().type)
      return null
    }
    const app = (themeType: string) => (
      <BolioUIProvider themeType={themeType} themes={[custom, other]}>
        <Probe />
      </BolioUIProvider>
    )

    const view = render(app('custom-dark'))
    view.rerender(app('custom-light'))

    expect(new Set(seen)).toEqual(new Set(['custom-dark', 'custom-light']))
  })
})
