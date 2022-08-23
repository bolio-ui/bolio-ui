import React, { useCallback, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { BolioUIProvider, CssBaseline, useTheme } from 'core'
import { SettingsContext, themes, ThemeType } from 'src/utils/use-settings'
import Favicon from 'src/components/Favicon'

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
        <title>Bolio UI</title>
        <meta
          name="description"
          content="Make your development more creative and dynamic with amazing tools for React."
        />
        <Favicon />
      </Head>
      <BolioUIProvider themeType={themeType}>
        <SettingsContext.Provider value={{ themeType, switchTheme }}>
          <CssBaseline />
          <Component {...pageProps} />
        </SettingsContext.Provider>
        <style global jsx>{`
          .tag {
            color: ${theme.palette.accents_5};
          }
          .punctuation {
            color: ${theme.palette.accents_5};
          }
          .attr-name {
            color: ${theme.palette.accents_6};
          }
          .attr-value {
            color: ${theme.palette.accents_4};
          }
          .language-javascript {
            color: ${theme.palette.accents_4};
          }
          span.class-name {
            color: ${theme.palette.warning};
          }
          span.maybe-class-name {
            color: ${theme.palette.purple};
          }
          span.token.string {
            color: ${theme.palette.accents_5};
          }
          span.token.comment {
            color: ${theme.palette.accents_3};
          }
          span.keyword {
            color: ${theme.palette.info};
          }
          span.plain-text {
            color: ${theme.palette.accents_3};
          }
        `}</style>
      </BolioUIProvider>
    </>
  )
}

export default App
