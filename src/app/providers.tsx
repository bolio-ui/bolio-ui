'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BolioUIProvider, CssBaseline, useTheme } from 'core'
import { StyledJsxRegistry } from 'core/Next'
import { SettingsContext, themes, ThemeType } from 'src/utils/use-settings'
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
    `}</style>
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [themeType, setThemeType] = useState<ThemeType>('dark')

  useEffect(() => {
    const theme = window.localStorage.getItem('theme') as ThemeType
    if (themes.includes(theme)) setThemeType(theme)
  }, [])

  // The page is served in dark. When the saved theme is light, the script in
  // the root layout keeps it hidden on a light background until that theme is
  // rendered.
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
    <StyledJsxRegistry>
      <BolioUIProvider themeType={themeType}>
        <SettingsContext.Provider value={{ themeType, switchTheme }}>
          <Analytics />
          <CssBaseline />
          <KBarProvider>
            <Navigation />
            {children}
          </KBarProvider>
        </SettingsContext.Provider>
        <MdxGlobalStyles />
      </BolioUIProvider>
    </StyledJsxRegistry>
  )
}
