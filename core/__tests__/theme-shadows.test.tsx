import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Themes, useTheme } from '..'

const Probe = () => {
  const { expressiveness } = useTheme()
  return (
    <ul>
      {(['shadowSmall', 'shadowMedium', 'shadowLarge'] as const).map((name) => (
        <li key={name} data-testid={name}>
          {expressiveness[name]}
        </li>
      ))}
    </ul>
  )
}

const shadows = (
  themeType: string,
  themes?: React.ComponentProps<typeof BolioUIProvider>['themes']
) => {
  const view = render(
    <BolioUIProvider themeType={themeType} themes={themes}>
      <Probe />
    </BolioUIProvider>
  )
  const read = (name: string) => screen.getByTestId(name).textContent as string
  const result = {
    small: read('shadowSmall'),
    medium: read('shadowMedium'),
    large: read('shadowLarge')
  }
  view.unmount()
  return result
}

describe('theme shadows', () => {
  it('has plain black shadows on the dark theme, with no edge of light', () => {
    // An inset edge of light draws a hard 1px line along the whole outline of
    // a box, corners included, and on a dark surface it reads as an outline.
    expect(shadows('dark')).toEqual({
      small: '0 5px 10px rgba(0, 0, 0, 0.3)',
      medium: '0 8px 30px rgba(0, 0, 0, 0.35)',
      large: '0 30px 60px rgba(0, 0, 0, 0.45)'
    })
  })

  it('has plain black shadows on the light theme', () => {
    expect(shadows('light')).toEqual({
      small: '0 5px 10px rgba(0, 0, 0, 0.12)',
      medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
      large: '0 30px 60px rgba(0, 0, 0, 0.12)'
    })
  })

  it('lets a theme made from the dark one change a shadow and keep the others', () => {
    const midnight = Themes.createFromDark({
      type: 'midnight',
      expressiveness: { shadowMedium: 'none' }
    })
    const result = shadows('midnight', [midnight])
    expect(result.medium).toBe('none')
    expect(result.large).toBe('0 30px 60px rgba(0, 0, 0, 0.45)')
  })
})
