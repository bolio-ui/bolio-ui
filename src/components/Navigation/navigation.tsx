import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'
import {
  Container,
  Grid,
  Row,
  Spacer,
  Button,
  Link,
  useTheme,
  useBodyScroll
} from 'core'
import { Heart, Menu, X } from '@bolio-ui/icons'
import { useMediaQuery } from 'src/utils/use-media-query'
import Logo from 'src/components/Logo'
import NavigationMobile from 'src/components/NavigationMobile'
import VersionSelect from 'src/components/VersionSelect'
import AccentSelect from 'src/components/AccentSelect'
import ThemeModeSelect from 'src/components/ThemeModeSelect'
import SearchInput from 'src/components/Search/instant-search'
import styles from './navigation.module.css'

// Plain links, not Tabs: they navigate between pages
const navLinks = [
  { label: 'Guide', href: '/docs/guide/getting-started', base: '/docs/guide' },
  {
    label: 'Components',
    href: '/docs/components/overview',
    base: '/docs/components'
  },
  { label: 'Hooks', href: '/docs/hooks/use-body-scroll', base: '/docs/hooks' },
  {
    label: 'Theme Generator',
    href: '/theme-generator',
    base: '/theme-generator'
  }
]

const Navigation: React.FC = () => {
  const theme = useTheme()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<boolean>(false)
  const [, setBodyHidden] = useBodyScroll(null, { delayReset: 300 })
  const isMobile = useMediaQuery(1280)

  useEffect(() => {
    setBodyHidden(expanded)
  }, [expanded, setBodyHidden])

  useEffect(() => {
    if (!isMobile) {
      setExpanded(false)
    }
  }, [isMobile])

  // close the mobile menu after navigating
  useEffect(() => {
    setExpanded(false)
  }, [pathname])

  return (
    <>
      <nav className={styles.wrapper}>
        <Container>
          <div
            className={styles.sticky}
            style={
              {
                '--nav-bg': theme.palette.background,
                '--nav-border': theme.palette.border,
                '--nav-gap': theme.layout.gap,
                '--nav-muted': theme.palette.accents_5,
                '--nav-hover-bg': theme.palette.accents_2,
                '--nav-foreground': theme.palette.foreground,
                '--nav-primary': theme.palette.primary
              } as React.CSSProperties
            }
          >
            <Grid.Container gap={1} justify="center">
              {/* Both layouts come in the server HTML and CSS shows the one
                  for the screen, so the navbar is ready on the first paint */}
              <div className={styles.desktop}>
                <Grid xs={6} md={6} justify="flex-start">
                  <div className={styles.brand}>
                    <div className={styles.logoWrapper}>
                      <Logo name="Bolio UI" />
                    </div>
                    <div className={styles.tabs}>
                      {navLinks.map(({ label, href, base }) => {
                        const active = pathname.startsWith(base)
                        return (
                          <NextLink
                            key={href}
                            href={href}
                            className={
                              active
                                ? `${styles.navLink} ${styles.active}`
                                : styles.navLink
                            }
                            aria-current={active ? 'page' : undefined}
                          >
                            <span
                              className={styles.navLabel}
                              data-label={label}
                            >
                              {label}
                            </span>
                          </NextLink>
                        )
                      })}
                    </div>
                  </div>
                </Grid>

                <Grid xs={6} md={6} justify="flex-end">
                  <div className={styles.controls}>
                    <>
                      <VersionSelect />
                      <SearchInput />
                      <ThemeModeSelect />
                      <AccentSelect />
                      <Link
                        href="https://www.patreon.com/brunnoandrade"
                        target="_blank"
                      >
                        <Button
                          icon={<Heart fill="red" stroke="red" />}
                          auto
                          scale={0.75}
                          type="secondary-light"
                          rounded
                          aria-label="Button Sponsor"
                        >
                          Sponsor
                        </Button>
                      </Link>
                    </>
                  </div>
                </Grid>
              </div>
              <div className={styles.mobile}>
                <Grid xs={2} md={4} style={{ marginTop: '8px' }}>
                  <Logo name="Bolio UI" />
                </Grid>

                <Grid xs={10} md={8}>
                  <Row justify="end" align="middle">
                    <SearchInput />
                    <Spacer w={1} />
                    <div className={styles.controls}>
                      <ThemeModeSelect />
                      <Button
                        className={styles.menuToggle}
                        auto
                        type="abort"
                        aria-label={expanded ? 'Close menu' : 'Open menu'}
                        aria-expanded={expanded}
                        onClick={() => setExpanded(!expanded)}
                      >
                        {expanded ? (
                          <X fontSize={16} />
                        ) : (
                          <Menu fontSize={16} />
                        )}
                      </Button>
                    </div>
                  </Row>
                </Grid>
              </div>
            </Grid.Container>
          </div>
        </Container>
      </nav>
      <NavigationMobile expanded={expanded} />
    </>
  )
}

export default Navigation
