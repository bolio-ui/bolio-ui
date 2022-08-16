import React, { useState, useEffect } from 'react'
import { Button, useTheme } from 'core'
import { Sun, Moon } from '@bolio-ui/icons'
import { useSettings } from 'src/utils/use-settings'
import Logo from 'src/components/Logo'

const Menu: React.FC = () => {
  const theme = useTheme()
  const settings = useSettings()

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
            <div>
              <Button
                aria-label="Toggle Dark mode"
                className="theme-button"
                auto
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
            </div>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .wrapper {
          height: 48px;
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
          background-color: ${theme.palette.background};
          font-size: 16px;
          height: 54px;
          box-sizing: border-box;
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
          background: ${theme.palette.background};
          box-shadow: ${theme.type === 'dark'
            ? 'rgba(255, 255, 255, 0.1) 0 0 20px 0'
            : 'rgba(0, 0, 0, 0.1) 0 0 20px 0'};
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

        .submenu__wrapper {
          height: 48px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 -1px ${theme.palette.border};
        }
        .submenu_sticky {
          transition: box-shadow 0.2s ease;
        }
        .submenu_sticky {
          position: fixed;
          z-index: 1100;
          top: 0;
          right: 0;
          left: 0;
          background: ${theme.palette.background};
          box-shadow: ${theme.type === 'dark'
            ? `inset 0 -1px ${theme.palette.border}`
            : 'rgba(0, 0, 0, 0.1) 0 0 15px 0'};
        }
        .submenu__inner {
          display: flex;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: 0 ${theme.layout.pageMargin};
          height: 48px;
          box-sizing: border-box;
          overflow-y: hidden;
          overflow-x: auto;
          overflow: -moz-scrollbars-none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          box-sizing: border-box;
        }
      `}</style>
    </>
  )
}

export default Menu
