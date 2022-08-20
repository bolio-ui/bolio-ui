import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Spacer, Button, Tabs, Link, useTheme } from 'core'
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
      <nav className="wrapper">
        <div className={`${sticky ? 'menu_sticky' : ''}`}>
          <div className="menu-nav">
            <div className="menu-nav__title">
              <Logo name="Bolio UI" />
            </div>

            <div className="tabs">
              <Tabs
                value={router.asPath}
                onChange={(route) => router.push(route)}
                align="center"
                hideDivider
                hideBorder
              >
                <Tabs.Item label="Home" value="/" />
                <Tabs.Item label="Guide" value="/guide" />
                <Tabs.Item label="Components" value="/components" />
                <Tabs.Item label="Hooks" value="/hooks/use-body-scroll" />
              </Tabs>
            </div>

            <div className="controls">
              <Link href="https://github.com/bolio-ui/bolio-ui" target="_blank">
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
              <Link href="https://www.instagram.com/bolio.ui/" target="_blank">
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
              <Spacer w={0} />
              <Button
                w="28px"
                h="28px"
                py={0}
                px={0}
                aria-label="Toggle Dark mode"
                className="theme-button"
                type="abort"
                onClick={() =>
                  settings.switchTheme(theme.type === 'dark' ? 'light' : 'dark')
                }
              >
                {theme.type === 'dark' ? (
                  <Sun fontSize={16} />
                ) : (
                  <Moon fontSize={16} />
                )}
              </Button>
              <Spacer w={0} />
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
          </div>
        </div>
      </nav>
      <style jsx>{`
        .wrapper {
          height: 76px;
          position: relative;
          overflow: hidden;
        }
        .menu-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          font-size: 16px;
          height: 76px;
          box-sizing: border-box;
          backdrop-filter: saturate(180%) blur(10px);
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
        }
        .menu-nav__title {
          margin-top: 10px;
        }
        .menu-nav > div {
          display: flex;
          align-items: center;
        }
        .menu-nav :global(.theme-button) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.25rem;
          height: 2.25rem;
          padding: 0;
          margin: 0 ${theme.layout.gapHalf};
        }
        .user-settings__button {
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          appearance: none;
          cursor: pointer;
        }
        :global(.user-settings__popover) {
          width: 180px !important;
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
          flex: 1 1 1;
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
