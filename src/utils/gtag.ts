interface ExtendedWindow extends Window {
  gtag?: (
    command: 'config' | 'event' | 'consent',
    trackingId: string,
    config?: { [key: string]: unknown }
  ) => void
}

declare let window: ExtendedWindow

export const GA_TRACKING_ID: string = process.env.NEXT_PUBLIC_GA_TRACKING || ''

// Analytics runs only on the deployed site, so visits in `next dev` do not
// count in the same property
export const ANALYTICS_ENABLED =
  process.env.NODE_ENV === 'production' && GA_TRACKING_ID !== ''

// 'granted' or 'denied', as the visitor chose in the consent banner. Without
// a choice, analytics storage stays denied.
export const CONSENT_KEY = 'analytics-consent'

export const getConsent = (): 'granted' | 'denied' | null => {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY)
    return saved === 'granted' || saved === 'denied' ? saved : null
  } catch {
    return null
  }
}

export const setConsent = (choice: 'granted' | 'denied'): void => {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice)
  } catch {
    // the choice still applies to this visit
  }
  if (window.gtag)
    window.gtag('consent', 'update', { analytics_storage: choice })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  if (window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value
}: {
  action: string
  category: string
  label: string
  value: number
}): void => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  }
}
