import React, { useCallback, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { BolioUIProvider, CssBaseline, Image, useTheme } from 'core'
import { SettingsContext, themes, ThemeType } from 'src/utils/use-settings'
import { KBarWrapper as KBarProvider } from 'src/components'
import { MDXProvider } from '@mdx-js/react'
import { HybridCode, HybridLink } from 'src/components'
import Favicon from 'src/components/Favicon'
import Navigation from 'src/components/Navigation'
import SEO from '../../next-seo.config'

function App({ Component, pageProps }: AppProps) {
  const theme = useTheme()

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

  return (
    <>
      <Head>
        <title>
          Bolio UI - Amazing, modern and creative tools for React UI
        </title>
        <meta
          name="description"
          content="Make your development more amazing, modern and creative with tools for React."
        />
        <Favicon />
      </Head>
      <BolioUIProvider themeType={themeType}>
        <SettingsContext.Provider value={{ themeType, switchTheme }}>
          <DefaultSeo {...SEO} />
          <CssBaseline />
          <KBarProvider>
            <Navigation />
            <MDXProvider
              components={{
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
