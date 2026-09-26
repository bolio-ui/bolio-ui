import React from 'react'
import type { Metadata, Viewport } from 'next'
import { palette as darkPalette } from 'core/Themes/Presets/Dark'
import { palette as lightPalette } from 'core/Themes/Presets/Default'
import Favicon from 'src/components/Favicon'
import Providers from './providers'

const title = 'Bolio UI - Amazing, modern and creative tools for React UI'
const description =
  'Make your development more amazing with tools Bolio UI. Easy customization and clear documentation. Compatible with Next.js, Gatsby.js, RedwoodJS, Vite, and Remix. Transform your development experience now!'

export const metadata: Metadata = {
  metadataBase: new URL('https://bolio-ui.com'),
  title: { default: title, template: `%s | ${title}` },
  description,
  keywords: [
    'React',
    'Next.js',
    'Bolio UI',
    'React Aria',
    'React Components',
    'UI Components',
    'UI Kit',
    'UI Library',
    'UI Framework',
    'UI Design System'
  ],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Bolio UI',
    title,
    description,
    images: [{ url: '/cover.jpg', width: 1200, height: 630, alt: title }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bolio_ui',
    creator: '@bolio_ui'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  themeColor: '#000'
}

// The page is served in dark. When the saved theme is light, this keeps it
// hidden on a light background until Providers renders that theme. The colors
// are the themes' own backgrounds, so nothing changes color when React loads.
const themeScript = `
(function(){
  var theme = 'dark';
  try {
    if (window.localStorage.getItem('theme') === 'light') theme = 'light';
  } catch (e) {}
  var background = theme === 'light' ? '${lightPalette.background}' : '${darkPalette.background}';
  document.documentElement.style.background = background;
  document.body.style.background = background;
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme-pending', theme);
  }
})()`

const themePendingStyle = `
html[data-theme-pending] body {
  visibility: hidden;
  animation: bolio-theme-reveal 0s linear 2s forwards;
}
@keyframes bolio-theme-reveal {
  to { visibility: visible; }
}`

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Providers is a Client Component and cannot read process.env itself
  // (only NEXT_PUBLIC_ vars are exposed to the client bundle), so the flag
  // is resolved here and passed down.
  const disableServiceWorker = process.env.ENVIRONMENT === 'develop'

  return (
    // the theme script changes <html> and <body> before React hydrates them
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themePendingStyle }} />
        <Favicon />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers disableServiceWorker={disableServiceWorker}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
