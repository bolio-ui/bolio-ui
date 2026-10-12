import { track } from '../gtag'

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
