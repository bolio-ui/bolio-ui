import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Grid, Spacer, Button, Tabs, Link, useTheme } from 'core'
import { Sun, Moon, Heart, Github, Instagram } from '@bolio-ui/icons'
import { useSettings } from 'src/utils/use-settings'
import Logo from 'src/components/Logo'

const Menu: React.FC = () => {
  const theme = useTheme()
  const settings = useSettings()
  const router = useRouter()

  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    const scrollHandler = () =>
      setSticky(document.documentElement.scrollTop > 0)
    document.addEventListener('scroll', scrollHandler)
    return () => document.removeEventListener('scroll', scrollHandler)
  }, [setSticky])

  return (
    <>
      <nav>
        <Container fluid>
          <div className={`${sticky ? 'menu_sticky' : ''}`}>
            <Grid.Container
              gap={1}
              justify="center"
              alignItems="center"
              alignContent="center"
            >
              <Grid xs justify="flex-start">
                <Logo name="Bolio UI" />
              </Grid>

              <Grid xs justify="center">
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
                      value="/docs/components/getting-started"
                    />
                    <Tabs.Item
                      label="Hooks"
                      value="/docs/hooks/use-body-scroll"
                    />
                  </Tabs>
                </div>
              </Grid>

              <Grid xs justify="flex-end">
                <div className="controls">
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
                      width="0"
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
                        <Heart fill="red" stroke="red" height={12} width={12} />
                      }
                      auto
                      scale={0.75}
                    >
                      Sponsor
                    </Button>
                  </Link>
                </div>
              </Grid>
            </Grid.Container>
          </div>
        </Container>
      </nav>
      <style jsx>{`
        .menu_sticky {
          transition: box-shadow 0.2s ease;
        }
        .menu_sticky {
          position: fixed;
          z-index: 1100;
          top: 0;
          right: 0;
          left: 0;
          padding: 0 15px;
          box-shadow: ${theme.type === 'dark'
            ? 'rgba(255, 255, 255, 0.1) 0 0 20px 0'
            : 'rgba(0, 0, 0, 0.1) 0 0 20px 0'};
          backdrop-filter: saturate(180%) blur(10px);
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

export default Menu
