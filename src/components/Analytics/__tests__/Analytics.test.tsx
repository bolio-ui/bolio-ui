import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { CONSENT_EVENT, CONSENT_KEY } from 'src/utils/gtag'
import Analytics from '..'

// next/script runs in the browser only: a plain tag is enough to see it load
jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ src }: { src?: string }) => (
    <script data-testid="ga" data-src={src} />
  )
}))

let mockEnabled = true
jest.mock('src/utils/gtag', () => ({
  ...jest.requireActual('src/utils/gtag'),
  get ANALYTICS_ENABLED() {
    return mockEnabled
  }
}))

describe('<Analytics />', () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockEnabled = true
  })

  it('loads nothing until the visitor accepts', () => {
    render(<Analytics />)
    expect(screen.queryAllByTestId('ga')).toHaveLength(0)
  })

  it('loads nothing for a visitor who declined', () => {
    window.localStorage.setItem(CONSENT_KEY, 'denied')
    render(<Analytics />)
    expect(screen.queryAllByTestId('ga')).toHaveLength(0)
  })

  it('loads right after the visitor accepts', () => {
    render(<Analytics />)
    act(() => {
      window.localStorage.setItem(CONSENT_KEY, 'granted')
      window.dispatchEvent(new Event(CONSENT_EVENT))
    })
    expect(screen.getAllByTestId('ga').length).toBeGreaterThan(0)
  })

  it('loads on the next visit of a visitor who accepted', () => {
    window.localStorage.setItem(CONSENT_KEY, 'granted')
    render(<Analytics />)
    expect(screen.getAllByTestId('ga').length).toBeGreaterThan(0)
  })

  it('does not load where analytics is off, even when accepted', () => {
    mockEnabled = false
    window.localStorage.setItem(CONSENT_KEY, 'granted')
    render(<Analytics />)
    expect(screen.queryAllByTestId('ga')).toHaveLength(0)
  })
})
