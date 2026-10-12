import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider } from 'core'
import { CONSENT_KEY } from 'src/utils/gtag'
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

const gtag = jest.fn()

describe('<ConsentBanner />', () => {
  beforeEach(() => {
    window.localStorage.clear()
    gtag.mockClear()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
  })

  it('asks once, and sends the answer to Google', () => {
    load(true)
    fireEvent.click(screen.getByRole('button', { name: 'Accept analytics' }))
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('granted')
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted'
    })
    expect(screen.queryByRole('region', { name: 'Analytics' })).toBeNull()
  })

  it('links to the privacy page', () => {
    load(true)
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
      'href',
      '/privacy'
    )
  })

  it('keeps analytics denied when the visitor declines', () => {
    load(true)
    fireEvent.click(screen.getByRole('button', { name: 'Decline' }))
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('denied')
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'denied'
    })
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
