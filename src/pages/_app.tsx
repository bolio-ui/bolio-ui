import React, { useCallback, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import { BolioUIProvider, CssBaseline, useTheme } from 'core'
import { SettingsContext, themes, ThemeType } from 'src/utils/use-settings'
import { KBarWrapper as KBarProvider } from 'src/components'
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
            <Component {...pageProps} />
          </KBarProvider>
        </SettingsContext.Provider>
        <style global jsx>{`
          pre {
            background-color: ${theme.palette.pre};
          }
          pre code {
            color: ${theme.palette.accents_1};
          }
          .tag {
            color: ${theme.palette.error};
          }
          .punctuation {
            color: ${theme.palette.accents_1};
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
            color: ${theme.palette.accents_1};
          }
          .literal-property.property {
            color: ${theme.palette.accents_1};
          }
          .function {
            color: ${theme.palette.primary};
          }
          .parameter {
            color: ${theme.palette.accents_1};
          }
          span.class-name {
            color: ${theme.palette.warningLighter};
          }
          span.maybe-class-name {
            color: ${theme.palette.accents_1};
          }
          span.token.string {
            color: ${theme.palette.successLight};
          }
          span.token.comment {
            color: ${theme.palette.accents_3};
          }
          span.operator {
            color: ${theme.palette.accents_1};
          }
          span.constant {
            color: ${theme.palette.accents_1};
          }
          span.number {
            color: ${theme.palette.accents_1};
          }
          span.keyword {
            color: ${theme.palette.violetLighter};
          }
          span.plain-text {
            color: ${theme.palette.accents_1};
          }
        `}</style>
      </BolioUIProvider>
    </>
  )
}

export default App
