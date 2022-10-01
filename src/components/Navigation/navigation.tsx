import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import {
  Container,
  Grid,
  Spacer,
  Button,
  Tabs,
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
  Menu
} from '@bolio-ui/icons'
import { useMediaQuery } from 'src/utils/use-media-query'
import { useSettings } from 'src/utils/use-settings'
import Logo from 'src/components/Logo'
import NavigationMobile from 'src/components/NavigationMobile'

const SearchInput = dynamic(() => import('../Search/instant-search'), {
  ssr: true
})

const Navigation: React.FC = () => {
  const theme = useTheme()
  const settings = useSettings()
  const router = useRouter()
  const [expanded, setExpanded] = useState<boolean>(false)
  const [, setBodyHidden] = useBodyScroll(null, { delayReset: 300 })
  const isMobile = useMediaQuery(1280)

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
          <div className={`${sticky ? 'menu_sticky' : 'menu'}`}>
            <Grid.Container gap={1} justify="center">
              {!isMobile ? (
                <>
                  <Grid
                    xs={6}
                    md={4}
                    justify="flex-start"
                    style={{ marginTop: '8px' }}
                  >
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
                            style={{
                              background:
                                'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
                              border: 'none'
                            }}
                          >
                            Sponsor
                          </Button>
                        </Link>
                      </>
                    </div>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid
                    xs={2}
                    md={4}
                    justify="flex-start"
                    style={{ marginTop: '8px' }}
                  >
                    <Logo name="Bolio UI" />
                  </Grid>

                  <Grid xs={10} md={8} justify="flex-end">
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
                        onClick={() => setExpanded(!expanded)}
                      >
                        <Menu fontSize={16} />
                      </Button>
                    </div>
                  </Grid>
                </>
              )}
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
          box-shadow: ${theme.type === 'dark'
            ? 'rgba(255, 255, 255, 0.1) 0 0 20px 0'
            : 'rgba(0, 0, 0, 0.1) 0 0 20px 0'};
          backdrop-filter: saturate(180%) blur(10px);
          transition: box-shadow 1s ease;
          transition: backdrop-filter 1s ease;
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

        .logo {
          padding: 0 ${theme.layout.gap};
          margin-bottom: 3px;
        }
        .tabs {
          padding: 0 ${theme.layout.gap};
          margin-bottom: 3px;
        }
        .tabs :global(.content) {
          display: none;
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
