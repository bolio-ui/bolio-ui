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
import {
  Sun,
  Moon,
  Heart,
  Github,
  Instagram,
  Twitter,
  Menu,
  X
} from '@bolio-ui/icons'
import { useMediaQuery } from 'src/utils/use-media-query'
import { useSettings } from 'src/utils/use-settings'
import Logo from 'src/components/Logo'
import NavigationMobile from 'src/components/NavigationMobile'
import VersionSelect from 'src/components/VersionSelect'
import SearchInput from 'src/components/Search/instant-search'

// Plain links, not Tabs: they navigate between pages
const navLinks = [
  { label: 'Guide', href: '/docs/guide/getting-started' },
  { label: 'Components', href: '/docs/components/avatar' },
  { label: 'Hooks', href: '/docs/hooks/use-body-scroll' },
  { label: 'Theme Generator', href: '/theme-generator' }
]

const Navigation: React.FC = () => {
  const theme = useTheme()
  const settings = useSettings()
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
      <nav className="menu_wrapper">
        <Container>
          <div className="menu_sticky">
            <Grid.Container gap={1} justify="center">
              {/* Both layouts come in the server HTML and CSS shows the one
                  for the screen, so the navbar is ready on the first paint */}
              <div className="nav-desktop">
                <Grid xs={6} md={6} justify="flex-start">
                  <div className="brand">
                    <div className="logo-wrapper">
                      <Logo name="Bolio UI" />
                    </div>
                    <div className="tabs">
                      {navLinks.map(({ label, href }) => (
                        <NextLink
                          key={href}
                          href={href}
                          className={
                            pathname === href ? 'nav-link active' : 'nav-link'
                          }
                          aria-current={pathname === href ? 'page' : undefined}
                        >
                          {label}
                        </NextLink>
                      ))}
                    </div>
                  </div>
                </Grid>

                <Grid xs={6} md={6} justify="flex-end">
                  <div className="controls">
                    <>
                      <Link
                        href="https://github.com/bolio-ui/bolio-ui"
                        target="_blank"
                        aria-label="Link to Github Bolio UI"
                      >
                        <Button
                          w="28px"
                          h="28px"
                          py={0}
                          px={0}
                          className="theme-button"
                          aria-label="Github Bolio UI"
                          type="abort"
                        >
                          <Github fontSize={16} />
                        </Button>
                      </Link>
                      <Link
                        href="https://www.twitter.com/bolio_ui/"
                        target="_blank"
                        aria-label="Link to Twitter Bolio UI"
                      >
                        <Button
                          w="28px"
                          h="28px"
                          py={0}
                          px={0}
                          className="theme-button"
                          aria-label="Twitter Bolio UI"
                          type="abort"
                        >
                          <Twitter fontSize={16} />
                        </Button>
                      </Link>
                      <Link
                        href="https://www.instagram.com/bolio.ui/"
                        target="_blank"
                        aria-label="Link to Instagram Bolio UI"
                      >
                        <Button
                          w="28px"
                          h="28px"
                          py={0}
                          px={0}
                          className="theme-button"
                          aria-label="Instagram Bolio UI"
                          type="abort"
                        >
                          <Instagram fontSize={16} />
                        </Button>
                      </Link>
                      <Button
                        w="28px"
                        h="28px"
                        py={0}
                        px={0}
                        aria-label="Toggle Dark mode"
                        className="theme-button"
                        type="abort"
                        onClick={() =>
                          settings.switchTheme(
                            theme.type === 'dark' ? 'light' : 'dark'
                          )
                        }
                      >
                        {theme.type === 'dark' ? (
                          <Sun fontSize={16} />
                        ) : (
                          <Moon fontSize={16} />
                        )}
                      </Button>
                      <Spacer w={0.5} />
                      <VersionSelect />
                      <Spacer w={0.5} />
                      <SearchInput />
                      <Spacer w={1} />
                      <Link
                        href="https://www.patreon.com/brunnoandrade"
                        target="_blank"
                      >
                        <Button
                          icon={
                            <Heart
                              fill="red"
                              stroke="red"
                              height={12}
                              width={12}
                            />
                          }
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
              <div className="nav-mobile">
                <Grid xs={2} md={4} style={{ marginTop: '8px' }}>
                  <Logo name="Bolio UI" />
                </Grid>

                <Grid xs={10} md={8}>
                  <Row justify="end" align="middle">
                    <SearchInput />
                    <Spacer w={1} />
                    <div className="controls">
                      <Button
                        w="28px"
                        h="28px"
                        py={0}
                        px={0}
                        aria-label="Toggle Dark mode"
                        className="theme-button"
                        type="abort"
                        onClick={() =>
                          settings.switchTheme(
                            theme.type === 'dark' ? 'light' : 'dark'
                          )
                        }
                      >
                        {theme.type === 'dark' ? (
                          <Sun fontSize={16} />
                        ) : (
                          <Moon fontSize={16} />
                        )}
                      </Button>
                      <Button
                        className="menu-toggle"
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
      <style jsx>{`
        .menu_wrapper {
          height: 60px;
          position: relative;
          overflow: hidden;
          z-index: 99;
        }
        .menu_sticky {
          z-index: 1;
          position: fixed;
          z-index: 1100;
          top: 0;
          right: 0;
          left: 0;
          background-color: ${theme.palette.background};
          border-bottom: 1px solid ${theme.palette.border};
          padding-left: 15px;
          padding-right: 15px;
        }
        .nav-desktop {
          display: contents;
        }
        .nav-mobile {
          display: none;
        }
        @media only screen and (max-width: 1280px) {
          .nav-desktop {
            display: none;
          }
          .nav-mobile {
            display: contents;
          }
        }
        .menu_wrapper :global(.theme-button) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          padding: 0;
        }

        .brand {
          display: flex;
          align-items: flex-start;
        }
        .logo-wrapper {
          margin-top: 8px;
        }
        .logo {
          padding: 0 ${theme.layout.gap};
          margin-bottom: 3px;
        }
        .tabs {
          display: flex;
          align-items: center;
          padding: 0 ${theme.layout.gap} 0 calc(${theme.layout.gap} + 12px);
          margin-bottom: 3px;
        }
        /* same look as the Tabs they replaced, hover highlight included */
        .tabs :global(.nav-link) {
          position: relative;
          z-index: 0;
          display: flex;
          align-items: center;
          white-space: nowrap;
          color: ${theme.palette.accents_5};
          font-size: 0.875rem;
          line-height: normal;
          padding: 0.875rem 0.55rem;
          margin: 0 0.2rem;
          text-decoration: none;
        }
        .tabs :global(.nav-link:first-child) {
          margin-left: 0;
        }
        .tabs :global(.nav-link::before) {
          content: '';
          position: absolute;
          z-index: -1;
          inset: 15% -7.5%;
          border-radius: 5px;
          background: ${theme.palette.accents_2};
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .tabs :global(.nav-link:hover) {
          color: ${theme.palette.foreground};
        }
        .tabs :global(.nav-link:hover::before) {
          opacity: 0.8;
        }
        .tabs :global(.nav-link.active) {
          color: ${theme.palette.foreground};
          font-weight: 500;
        }
        .tabs :global(.nav-link:focus-visible) {
          outline: 2px solid ${theme.palette.primary};
          outline-offset: -2px;
        }
        @media only screen and (max-width: ${theme.breakpoints.md.max}) {
          .tabs {
            display: none;
          }
        }

        .controls {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          height: 50px;
        }
        .controls :global(.menu-toggle) {
          display: flex;
          align-items: center;
          height: 50px;
        }
      `}</style>
    </>
  )
}

export default Navigation
