import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider } from 'core'
import { CONSENT_EVENT, CONSENT_KEY } from 'src/utils/gtag'
import ConsentBanner from '..'

let mockEnabled = true
jest.mock('src/utils/gtag', () => ({
  ...jest.requireActual('src/utils/gtag'),
  get ANALYTICS_ENABLED() {
    return mockEnabled
  }
}))

const load = (enabled: boolean) => {
  mockEnabled = enabled
  return render(
    <BolioUIProvider>
      <ConsentBanner />
    </BolioUIProvider>
  )
}

const changed = jest.fn()

describe('<ConsentBanner />', () => {
  beforeEach(() => {
    window.localStorage.clear()
    changed.mockClear()
    window.addEventListener(CONSENT_EVENT, changed)
  })

  it('asks once, and tells analytics when the visitor accepts', () => {
    load(true)
    fireEvent.click(screen.getByRole('button', { name: 'Accept analytics' }))
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('granted')
    expect(changed).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('region', { name: 'Analytics' })).toBeNull()
  })

  it('links to the privacy page', () => {
    load(true)
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '/privacy'
    )
  })

  it('keeps the decline when the visitor declines', () => {
    load(true)
    fireEvent.click(screen.getByRole('button', { name: 'Decline' }))
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('denied')
    expect(changed).toHaveBeenCalledTimes(1)
  })

  it('does not ask again after an answer', () => {
    window.localStorage.setItem(CONSENT_KEY, 'granted')
    load(true)
    expect(screen.queryByRole('region', { name: 'Analytics' })).toBeNull()
  })

  it('does not show where analytics is off', () => {
    load(false)
    expect(screen.queryByRole('region', { name: 'Analytics' })).toBeNull()
  })
})
