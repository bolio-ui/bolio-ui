'use client'

import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import {
  ANALYTICS_ENABLED,
  CONSENT_EVENT,
  GA_TRACKING_ID,
  getConsent
} from 'src/utils/gtag'

// Loads Google Analytics only for a visitor who accepted in the banner, on the
// next visit or right after the answer. Ad storage stays denied in any case.
const Analytics = () => {
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const sync = () => setAccepted(getConsent() === 'granted')
    sync()
    window.addEventListener(CONSENT_EVENT, sync)
    return () => window.removeEventListener(CONSENT_EVENT, sync)
  }, [])

  if (!ANALYTICS_ENABLED || !accepted) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied'
            });
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `
        }}
      />
    </>
  )
}

export default Analytics
