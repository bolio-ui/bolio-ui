import React from 'react'
import { Avatar, Button, useTheme, Popover } from 'core'
import { Sun, Moon } from '@bolio-ui/icons'
import UserSettings from './user-settings'
import { usePrefers } from 'src/utils/use-prefers'

const Menu: React.FC = () => {
  const theme = useTheme()
  const prefers = usePrefers()

  return (
    <>
      <nav className="menu-nav">
        <h1 className="menu-nav__title">Bolio UI</h1>
        <div>
          <Button
            aria-label="Toggle Dark mode"
            className="theme-button"
            auto
            type="abort"
            onClick={() =>
              prefers.switchTheme(theme.type === 'dark' ? 'light' : 'dark')
            }
          >
            {theme.type === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          <Popover
            content={<UserSettings />}
            placement="bottomEnd"
            portalClassName="user-settings__popover"
            trigger={'click'}
            disableItemsAutoClose={false}
            className={''}
            initialVisible={false}
            hideArrow={false}
            enterDelay={0}
            leaveDelay={0}
            offset={0}
            // onVisibleChange={function (visible: boolean): void {
            //   throw new Error('Function not implemented.')
            // }}
            type={'default'}
          >
            <button className="user-settings__button">
              <Avatar text="BA" />
            </button>
          </Popover>
        </div>
      </nav>
      <style jsx>{`
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
        .menu-nav__title {
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
          letter-spacing: 0;
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
      `}</style>
    </>
  )
}

export default Menu
