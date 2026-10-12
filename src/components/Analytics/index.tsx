import Script from 'next/script'
import { ANALYTICS_ENABLED, CONSENT_KEY, GA_TRACKING_ID } from 'src/utils/gtag'

// Google Consent Mode: everything starts denied, and analytics storage is
// granted only for a visitor who accepted in the banner (kept in localStorage).
const Analytics = () =>
  ANALYTICS_ENABLED ? (
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
            var accepted = false;
            try { accepted = window.localStorage.getItem('${CONSENT_KEY}') === 'granted'; } catch (e) {}
            gtag('consent', 'default', {
              analytics_storage: accepted ? 'granted' : 'denied',
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
  ) : null

export default Analytics
