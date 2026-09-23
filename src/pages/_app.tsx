import React, { useCallback, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { BolioUIProvider, CssBaseline, Image, useTheme } from 'core'
import { SettingsContext, themes, ThemeType } from 'src/utils/use-settings'
import { KBarWrapper as KBarProvider } from 'src/components'
import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import { HybridCode, HybridLink, HybridLinkHeading } from 'src/components'
import { DocsLayout } from 'src/templates/Docs'
import Favicon from 'src/components/Favicon'
import Navigation from 'src/components/Navigation'
import SEO from '../../next-seo.config'
import Analytics from 'src/components/Analytics'
import * as gtag from 'src/utils/gtag'

// theme.palette here must come from useTheme() called *inside* BolioUIProvider,
// not in App itself, otherwise it reads the default theme instead of the
// active one (see the render below).
function MdxGlobalStyles() {
  const theme = useTheme()

  return (
    <style global jsx>{`
      pre {
        background-color: ${theme.palette.pre};
      }
      pre code {
        color: #ffffff;
      }
      .pre header .name.active {
        background-color: ${theme.palette.pre};
        color: rgba(255, 255, 255, 0.7);
      }
      .linked-heading {
        scroll-margin-top: 75px;
      }
      .tag {
        color: ${theme.palette.error};
      }
      .punctuation {
        color: #ffffff;
      }
      .attr-name {
        color: ${theme.palette.warning};
      }
      .attr-value {
        color: ${theme.palette.error};
      }
      .language-javascript {
        color: ${theme.palette.accents_4};
      }
      .method.function.property-access {
        color: ${theme.palette.primary};
      }
      .property-access {
        color: #ffffff;
      }
      .literal-property.property {
        color: #ffffff;
      }
      .function {
        color: ${theme.palette.primary};
      }
      .parameter {
        color: #ffffff;
      }
      span.class-name {
        color: ${theme.palette.warningLighter};
      }
      span.maybe-class-name {
        color: #ffffff;
      }
      span.token.string {
        color: ${theme.palette.successLight};
      }
      span.token.comment {
        color: ${theme.palette.accents_3};
      }
      span.operator {
        color: #ffffff;
      }
      span.constant {
        color: #ffffff;
      }
      span.number {
        color: #ffffff;
      }
      span.keyword {
        color: ${theme.palette.secondaryLighter};
      }
      span.plain-text {
        color: #ffffff;
      }
    `}</style>
  )
}

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // DocsLayout is rendered here, outside Component, so it keeps its own
  // identity across navigations instead of being recreated by every page.
  const isDocsRoute = router.pathname.startsWith('/docs/')

  const [themeType, setThemeType] = useState<ThemeType>('dark')

  useEffect(() => {
    const theme = window.localStorage.getItem('theme') as ThemeType
    if (themes.includes(theme)) setThemeType(theme)
  }, [])

  // The page is served in dark. When the saved theme is light, the script in
  // _document keeps it hidden on a light background until that theme is rendered.
  useEffect(() => {
    const root = document.documentElement
    const pending = root.getAttribute('data-theme-pending')
    if (pending && pending !== themeType) return

    root.removeAttribute('data-theme-pending')
    root.removeAttribute('style')
    document.body.removeAttribute('style')
  }, [themeType])

  const switchTheme = useCallback((theme: ThemeType) => {
    setThemeType(theme)
    if (typeof window !== 'undefined' && window.localStorage)
      window.localStorage.setItem('theme', theme)
  }, [])

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <title>
          Bolio UI - Amazing, modern and creative tools for React UI
        </title>
        <meta
          name="description"
          content="Make your development more amazing with tools Bolio UI. Easy customization and clear documentation. Compatible with Next.js, Gatsby.js, RedwoodJS, Vite, and Remix. Transform your development experience now!"
        />
        <meta
          name="keywords"
          content="React, Next.js, Bolio UI, React Aria, React Components, UI Components, UI Kit, UI Library, UI Framework, UI Design System"
        />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000" />
        <link
          rel="manifest"
          href="/manifest.json"
          crossOrigin="use-credentials"
        />
        <Favicon />
      </Head>
      <BolioUIProvider themeType={themeType}>
        <SettingsContext.Provider value={{ themeType, switchTheme }}>
          <DefaultSeo {...SEO} />
          <Analytics />
          <CssBaseline />
          <KBarProvider>
            <Navigation />
            <MDXProvider
              components={
                {
                  h3: HybridLinkHeading,
                  a: HybridLink,
                  img: Image,
                  pre: HybridCode
                } as unknown as MDXComponents
              }
            >
              {isDocsRoute ? (
                <DocsLayout>
                  <Component {...pageProps} />
                </DocsLayout>
              ) : (
                <Component {...pageProps} />
              )}
            </MDXProvider>
          </KBarProvider>
        </SettingsContext.Provider>
        <MdxGlobalStyles />
      </BolioUIProvider>
    </>
  )
}

export default App
