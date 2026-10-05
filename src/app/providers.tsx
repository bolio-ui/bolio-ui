'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SerwistProvider } from '@serwist/turbopack/react'
import { BolioUIProvider, CssBaseline, useTheme } from 'core'
import { ThemeContext } from 'core/use-theme/theme-context'
import {
  accents,
  AccentName,
  mix,
  SettingsContext,
  themes,
  ThemePreference,
  ThemeType
} from 'src/utils/use-settings'
import { KBarWrapper as KBarProvider } from 'src/components'
import Navigation from 'src/components/Navigation'
import Analytics from 'src/components/Analytics'
import * as gtag from 'src/utils/gtag'

// theme.palette here must come from useTheme() called *inside* BolioUIProvider,
// not in Providers itself, otherwise it reads the default theme instead of the
// active one (see the render below).
function MdxGlobalStyles() {
  const theme = useTheme()
  // The code blocks are dark in both themes, but the dark theme's low accents
  // are near black: it uses lighter grays for comments and plain code.
  const isDark = theme.type === 'dark'
  const plainCode = isDark ? theme.palette.accents_7 : theme.palette.accents_4
  const comment = isDark ? theme.palette.accents_5 : theme.palette.accents_3

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
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
        color: ${plainCode};
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
        color: ${comment};
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
    `
      }}
    />
  )
}

// Applies the chosen accent over the active theme's palette. The first accent
// is the preset palette itself.
function AccentTheme({
  accent,
  children
}: {
  accent: AccentName
  children: React.ReactNode
}) {
  const theme = useTheme()
  const value = useMemo(() => {
    if (accent === accents[0].name) return theme
    const { color } = accents.find((item) => item.name === accent) ?? accents[0]
    return {
      ...theme,
      palette: {
        ...theme.palette,
        primary: color,
        primaryLight: mix(color, 255, 0.8),
        primaryLighter: mix(color, 255, 0.5),
        primaryDark: mix(color, 0, 0.7),
        link: color
      }
    }
  }, [theme, accent])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default function Providers({
  children,
  disableServiceWorker
}: {
  children: React.ReactNode
  disableServiceWorker: boolean
}) {
  const pathname = usePathname()
  const [themePreference, setThemePreference] =
    useState<ThemePreference>('dark')
  const [systemType, setSystemType] = useState<ThemeType>('dark')
  const themeType = themePreference === 'system' ? systemType : themePreference
  const [accent, setAccent] = useState<AccentName>(accents[0].name)

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemType(query.matches ? 'dark' : 'light')
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const saved = window.localStorage.getItem('accent')
    const found = accents.find((item) => item.name === saved)
    if (found) setAccent(found.name)
    const theme = window.localStorage.getItem('theme') as ThemePreference
    if (theme === 'system' || themes.includes(theme as ThemeType))
      setThemePreference(theme)
  }, [])

  // The script in the root layout keeps the page hidden, on the right
  // theme's background, until this mounts and its styles are applied.
  useEffect(() => {
    const root = document.documentElement
    const pending = root.getAttribute('data-theme-pending')
    if (pending && pending !== themeType) return

    root.removeAttribute('data-theme-pending')
    root.removeAttribute('style')
    document.body.removeAttribute('style')
  }, [themeType])

  const switchTheme = useCallback((theme: ThemePreference) => {
    setThemePreference(theme)
    if (typeof window !== 'undefined' && window.localStorage)
      window.localStorage.setItem('theme', theme)
  }, [])

  const switchAccent = useCallback((next: AccentName) => {
    setAccent(next)
    window.localStorage.setItem('accent', next)
  }, [])

  // Analytics already counts the first page, so only later navigations are sent
  const isFirstPage = useRef(true)
  useEffect(() => {
    if (isFirstPage.current) {
      isFirstPage.current = false
      return
    }
    gtag.pageview(pathname)
  }, [pathname])

  return (
    <SerwistProvider
      swUrl="/serwist/sw.js"
      disable={disableServiceWorker}
      cacheOnNavigation
      reloadOnOnline
    >
      <BolioUIProvider themeType={themeType}>
        <SettingsContext.Provider
          value={{
            themeType,
            themePreference,
            switchTheme,
            accent,
            switchAccent
          }}
        >
          <AccentTheme accent={accent}>
            <Analytics />
            <CssBaseline />
            <KBarProvider>
              <Navigation />
              {children}
            </KBarProvider>
            <MdxGlobalStyles />
          </AccentTheme>
        </SettingsContext.Provider>
      </BolioUIProvider>
    </SerwistProvider>
  )
}
