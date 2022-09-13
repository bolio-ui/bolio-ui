import React, { useMemo } from 'react'
import { useTheme } from 'core'
import SideItem from 'src/components/SideItem'
import { guide, components, hooks } from 'src/data/sidebar'

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
      <SideItem items={items} />
      <style jsx>{`
        .sides {
          width: 100%;
          padding-bottom: ${theme.layout.gap};
          /* cursor: pointer; */
        }
        .box {
          overflow-y: auto;
          overflow-x: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
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
        .box > :global(.item) {
          margin-bottom: 12pt;
        }
      `}</style>
    </div>
  )
}

export default Sidebar
