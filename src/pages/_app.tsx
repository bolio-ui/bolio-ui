import React, { useCallback, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { BolioUIProvider, CssBaseline, Image, useTheme } from 'core'
import { SettingsContext, themes, ThemeType } from 'src/utils/use-settings'
import { KBarWrapper as KBarProvider } from 'src/components'
import { MDXProvider } from '@mdx-js/react'
import { HybridCode, HybridLink, HybridLinkHeading } from 'src/components'
import Favicon from 'src/components/Favicon'
import Navigation from 'src/components/Navigation'
import SEO from '../../next-seo.config'
import Analytics from 'src/components/Analytics'
import * as gtag from 'src/utils/gtag'

function App({ Component, pageProps }: AppProps) {
  const theme = useTheme()
  const router = useRouter()

  const [themeType, setThemeType] = useState<ThemeType>('dark')

  useEffect(() => {
    document.documentElement.removeAttribute('style')
    document.body.removeAttribute('style')

    const theme = window.localStorage.getItem('theme') as ThemeType
    if (themes.includes(theme)) setThemeType(theme)
  }, [])

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
              components={{
                h3: HybridLinkHeading,
                a: HybridLink,
                img: Image,
                pre: HybridCode
              }}
            >
              <Component {...pageProps} />
            </MDXProvider>
          </KBarProvider>
        </SettingsContext.Provider>
        <style global jsx>{`
          pre {
            background-color: ${theme.palette.pre};
          }
          pre code {
            color: #ffffff;
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
      </BolioUIProvider>
    </>
  )
}

export default App
