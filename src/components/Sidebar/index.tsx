import React, { useMemo } from 'react'
import { useTheme, Grid } from 'core'
import { guide, components, hooks } from 'src/data/sidebar'
import ActiveLink from '../ActiveLink'
import ActiveCategory from '../ActiveCategory'

export interface SidebarProps {
  sidebar: string
}

const sidebarItems = {
  guide: guide,
  components: components,
  hooks: hooks
}

function Sidebar({ sidebar }: SidebarProps) {
  const theme = useTheme()

  const items = useMemo(() => {
    return sidebarItems[sidebar]
  }, [sidebar])

  return (
    <div className="sides box">
      {items.map((item, index) => {
        return (
          <Grid.Container gap={2} key={`${item.name}-${index}`}>
            {!item.url && <ActiveCategory name={item.name} icon={item.icon} />}
            {item.url && <ActiveLink href={item.url} text={item.name} />}
          </Grid.Container>
        )
      })}
      <style jsx>{`
        .sides {
          width: 100%;
          padding-bottom: ${theme.layout.gap};
        }
        .box {
          overflow-y: auto;
          overflow-x: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          /* align-items: center; */
          /* cursor: pointer; */
        }
        /* .box::-webkit-scrollbar {
          display: none;
        }
        .box {
          -ms-overflow-style: none;
          scrollbar-width: none;
        } */
        .box::-webkit-scrollbar {
          width: 0;
          background-color: transparent;
        }
        /* .box > :global(.item) {
          margin-bottom: 12pt;
        } */
      `}</style>
    </div>
  )
}

Sidebar.displayName = 'BolioUISidebar'
export default Sidebar
