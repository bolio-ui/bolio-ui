import { pageview, setConsent, track } from '../gtag'

describe('track', () => {
  afterEach(() => {
    delete (window as unknown as { gtag?: unknown }).gtag
  })

  it('sends the event to Google when analytics is loaded', () => {
    const gtag = jest.fn()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
    track('copy_code', { source: 'docs' })
    expect(gtag).toHaveBeenCalledWith('event', 'copy_code', { source: 'docs' })
  })

  it('does nothing when analytics is not loaded, as for a visitor who has not accepted', () => {
    expect(() => track('copy_code')).not.toThrow()
  })
})

describe('pageview', () => {
  afterEach(() => {
    delete (window as unknown as { gtag?: unknown }).gtag
  })

  it('sends a page_view event, not a second config', () => {
    const gtag = jest.fn()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
    pageview('/docs/components/button')
    expect(gtag).toHaveBeenCalledWith('event', 'page_view', {
      page_path: '/docs/components/button'
    })
  })
})

describe('setConsent', () => {
  afterEach(() => {
    delete (window as unknown as { gtag?: unknown }).gtag
  })

  it('tells Google to stop when a visitor who accepted declines', () => {
    const gtag = jest.fn()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
    setConsent('denied')
    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'denied'
    })
  })
})
