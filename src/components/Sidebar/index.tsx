import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
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

// Each page renders its own Sidebar, so it is created again on every navigation.
// The scroll is kept here to stay where the user was.
const scrollPositions: Record<string, number> = {}
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

function Sidebar({ sidebar }: SidebarProps) {
  const theme = useTheme()
  const boxRef = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = scrollPositions[sidebar] || 0
  }, [sidebar])

  const items = useMemo(() => {
    return sidebarItems[sidebar]
  }, [sidebar])

  return (
    <div
      ref={boxRef}
      className="sides box"
      onScroll={(event) => {
        scrollPositions[sidebar] = event.currentTarget.scrollTop
      }}
    >
      {items.map((item, index) => {
        return (
          <Grid.Container gap={2} key={`${item.name}-${index}`}>
            {!item.url && <ActiveCategory name={item.name} icon={item.icon} />}
            {item.url && (
              <ActiveLink
                href={item.url}
                text={item.name}
                target={item.target}
              />
            )}
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
