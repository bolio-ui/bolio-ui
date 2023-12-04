interface ExtendedWindow extends Window {
  gtag?: (
    command: 'config' | 'event',
    trackingId: string,
    config?: { [key: string]: unknown }
  ) => void
}

declare let window: ExtendedWindow

export const GA_TRACKING_ID: string = process.env.NEXT_PUBLIC_GA_TRACKING || ''

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
