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
  // Code blocks follow the theme: light surface in light mode, dark in dark mode.
  const isDark = theme.type === 'dark'
  const { palette } = theme
  const fg = isDark ? '#ffffff' : palette.accents_8
  const plainCode = isDark ? palette.accents_7 : palette.accents_5
  const comment = isDark ? palette.accents_5 : palette.accents_4
  const surface = isDark ? palette.pre : palette.accents_1
  const accent = isDark ? palette.primary : palette.primaryDark
  const keyword = isDark ? palette.secondaryLighter : palette.secondaryDark
  const string = isDark ? palette.successLight : palette.successDark
  const className = isDark ? palette.warningLighter : palette.warningDark
  const tag = isDark ? palette.error : palette.errorDark
  const attrName = isDark ? palette.warning : palette.warningDark

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
      pre {
        background-color: ${surface};
      }
      pre code {
        color: ${fg};
      }
      .pre header .name.active {
        background-color: ${surface};
        color: ${isDark ? 'rgba(255, 255, 255, 0.7)' : palette.accents_5};
      }
      .linked-heading {
        scroll-margin-top: 75px;
      }
      .tag {
        color: ${tag};
      }
      .punctuation {
        color: ${fg};
      }
      .attr-name {
        color: ${attrName};
      }
      .attr-value {
        color: ${tag};
      }
      .language-javascript {
        color: ${plainCode};
      }
      .method.function.property-access {
        color: ${accent};
      }
      .property-access {
        color: ${fg};
      }
      .literal-property.property {
        color: ${fg};
      }
      .function {
        color: ${accent};
      }
      .parameter {
        color: ${fg};
      }
      span.class-name {
        color: ${className};
      }
      span.maybe-class-name {
        color: ${fg};
      }
      span.token.string {
        color: ${string};
      }
      span.token.comment {
        color: ${comment};
      }
      span.operator {
        color: ${fg};
      }
      span.constant {
        color: ${fg};
      }
      span.number {
        color: ${fg};
      }
      span.keyword {
        color: ${keyword};
      }
      span.plain-text {
        color: ${fg};
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
        primaryDark: mix(color, 0, 0.7)
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
