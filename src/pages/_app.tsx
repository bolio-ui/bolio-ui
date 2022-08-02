import React, { useCallback, useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { BolioUIProvider, CssBaseline } from 'core'
import { PrefersContext, themes, ThemeType } from 'src/utils/use-prefers'
import Menu from 'src/components/Navigation/menu'
import Favicon from 'src/components/Favicon'

function App({ Component, pageProps }: AppProps) {
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
        <PrefersContext.Provider value={{ themeType, switchTheme }}>
          <CssBaseline />
          <Menu />
          <Component {...pageProps} />
        </PrefersContext.Provider>
      </BolioUIProvider>
    </>
  )
}

export default App
