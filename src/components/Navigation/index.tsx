import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Grid,
  Spacer,
  Button,
  Tabs,
  Link,
  useTheme,
  useMediaQuery,
  useBodyScroll
} from 'core'
import { Sun, Moon, Heart, Github, Instagram, Menu } from '@bolio-ui/icons'
import { useSettings } from 'src/utils/use-settings'
import Logo from 'src/components/Logo'
import NavigationMobile from 'src/components/NavigationMobile'

const Navigation: React.FC = () => {
  const theme = useTheme()
  const settings = useSettings()
  const router = useRouter()
  const [expanded, setExpanded] = useState<boolean>(false)
  const [, setBodyHidden] = useBodyScroll(null, { delayReset: 300 })
  const isMobile = useMediaQuery('sm', { match: 'down' })

  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    const scrollHandler = () =>
      setSticky(document.documentElement.scrollTop > 0)
    document.addEventListener('scroll', scrollHandler)
    return () => document.removeEventListener('scroll', scrollHandler)
  }, [setSticky])

  useEffect(() => {
    setBodyHidden(expanded)
  }, [expanded, setBodyHidden])

  useEffect(() => {
    if (!isMobile) {
      setExpanded(false)
    }
  }, [isMobile])

  useEffect(() => {
    const handleRouteChange = () => {
      setExpanded(false)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
    <>
      <nav className="menu_wrapper">
        <Container fluid>
          <div className={`${sticky ? 'menu_sticky' : ''}`}>
            <Grid.Container
              gap={1}
              justify="center"
              alignItems="center"
              alignContent="center"
            >
              <Grid xs={6} md={4} justify="flex-start">
                <Logo name="Bolio UI" />
              </Grid>

              <Grid xs={0} md={4} justify="center">
                <div className="tabs">
                  <Tabs
                    value={router.asPath}
                    onChange={(route) => router.push(route)}
                    align="center"
                    hideDivider
                    hideBorder
                  >
                    <Tabs.Item label="Home" value="/" />
                    <Tabs.Item
                      label="Guide"
                      value="/docs/guide/getting-started"
                    />
                    <Tabs.Item
                      label="Components"
                      value="/docs/components/avatar"
                    />
                    <Tabs.Item
                      label="Hooks"
                      value="/docs/hooks/use-body-scroll"
                    />
                  </Tabs>
                </div>
              </Grid>

              <Grid xs={6} md={4} justify="flex-end">
                <div className="controls">
                  {isMobile ? (
                    <Button
                      className="menu-toggle"
                      auto
                      type="abort"
                      onClick={() => setExpanded(!expanded)}
                    >
                      <Menu fontSize={16} />
                    </Button>
                  ) : (
                    <>
                      <Link
                        href="https://github.com/bolio-ui/bolio-ui"
                        target="_blank"
                      >
                        <Button
                          w="28px"
                          h="28px"
                          py={0}
                          px={0}
                          aria-label="Github Bolio UI"
                          type="abort"
                        >
                          <Github fontSize={16} />
                        </Button>
                      </Link>
                      <Spacer w={1} />
                      <Link
                        href="https://www.instagram.com/bolio.ui/"
                        target="_blank"
                      >
                        <Button
                          w="28px"
                          h="28px"
                          py={0}
                          px={0}
                          aria-label="Instagram Bolio UI"
                          type="abort"
                        >
                          <Instagram fontSize={16} />
                        </Button>
                      </Link>
                      <Spacer w={1} />
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
                        >
                          Sponsor
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </Grid>
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
        }
        .menu_sticky {
          transition: box-shadow 0.2s ease;
        }
        .menu_sticky {
          position: fixed;
          z-index: 1100;
          top: 0;
          right: 0;
          left: 0;
          box-shadow: ${theme.type === 'dark'
            ? 'rgba(255, 255, 255, 0.1) 0 0 20px 0'
            : 'rgba(0, 0, 0, 0.1) 0 0 20px 0'};
          backdrop-filter: saturate(180%) blur(10px);
          padding-left: 15px;
          padding-right: 15px;
        }
        .menu_wrapper :global(.theme-button) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          padding: 0;
        }

        .tabs {
          padding: 0 ${theme.layout.gap};
          margin-bottom: 3px;
        }
        .tabs :global(.content) {
          display: none;
        }
        @media only screen and (max-width: ${theme.breakpoints.xs.max}) {
          .tabs {
            display: none;
          }
        }

        .controls {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .controls :global(.menu-toggle) {
          display: flex;
          align-items: center;
          min-width: 40px;
          height: 40px;
          padding: 0;
        }
      `}</style>
    </>
  )
}

export default Navigation
