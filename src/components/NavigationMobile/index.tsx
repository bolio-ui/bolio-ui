import React from 'react'
import NextLink from 'next/link'
import { useTheme } from 'core'
import { ChevronRight } from '@bolio-ui/icons'
import { useRouter } from 'next/router'
import { menuMobile } from 'src/data/menuMobile'

interface Props {
  expanded: boolean
}

const MenuMobile: React.FC<Props> = ({ expanded }) => {
  const theme = useTheme()
  const { pathname } = useRouter()
  const [expandedGroupName, setExpandedGroupName] = React.useState<
    string | null
  >(null)

  const handleGroupClick = (name: string) => {
    setExpandedGroupName(expandedGroupName === name ? null : name)
  }

  if (!expanded) return null

  return (
    <div className="mobile-menu">
      <div className="content">
        <NextLink href={`/`}>
          <a className={`menu-item fadein ${pathname === `/` ? 'active' : ''}`}>
            {'Home'}
          </a>
        </NextLink>

        {menuMobile.map((item, index) => (
          <div
            key={item.name}
            className="fadein"
            style={{ animationDelay: `${(index + 1) * 50}ms` }}
          >
            <button
              className={`menu-item ${
                expandedGroupName === item.name && 'expanded'
              }`}
              onClick={() => handleGroupClick(item.name)}
            >
              <ChevronRight
                fontSize={10}
                strokeWidth={2}
                color={theme.palette.accents_4}
              />
              {item.name}
            </button>
            {expandedGroupName === item.name && (
              <div className="group">
                {item.children.map((section) => (
                  <div key={section.name}>
                    <span className="section-name">{section.name}</span>
                    {section.children.map((item) => (
                      <NextLink href={item.url || '/'} key={item.url}>
                        <a
                          className={`section-item ${
                            pathname === item.url ? 'active' : ''
                          }`}
                        >
                          {item.name}
                        </a>
                      </NextLink>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .mobile-menu {
          position: fixed;
          top: 64px;
          height: calc(100vh - 4px);
          width: 100vw;
          overflow-y: auto;
          z-index: 999;
          box-sizing: border-box;
          background-color: ${theme.palette.background};
          overflow-y: auto;
        }
        .fadein {
          animation: fadeIn 200ms ease;
          animation-fill-mode: forwards;
          opacity: 0;
        }
        .menu-item {
          padding: 0 ${theme.layout.gapHalf};
          margin: 0 ${theme.layout.gap};
          height: 48px;
          width: 100%;
          display: flex;
          align-items: center;
          border: none;
          background: none;
          outline: none;
          border-bottom: 1px solid ${theme.palette.accents_2};
          text-transform: capitalize;
          color: ${theme.palette.accents_6};
          cursor: pointer;
        }
        .menu-item :global(svg) {
          transform: translateX(${theme.layout.gapQuarterNegative});
          transition: transform 250ms ease;
        }
        .menu-item.expanded {
          border-bottom: none;
        }
        .menu-item.expanded :global(svg) {
          transform: rotate(90deg) translateY(${theme.layout.gapQuarter});
        }
        .group {
          background: ${theme.palette.accents_1};
          padding: 0 calc(${theme.layout.gap} * 1.5) ${theme.layout.gap};
          border-top: 1px solid ${theme.palette.accents_2};
        }
        .section-name {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: ${theme.palette.accents_5};
          margin-top: ${theme.layout.gap};
          margin-bottom: ${theme.layout.gapHalf};
        }
        .section-item {
          padding: ${theme.layout.gapQuarter} ${theme.layout.gap};
          margin: 0 ${theme.layout.gapQuarter};
          width: 100%;
          display: flex;
          align-items: center;
          border: none;
          background: none;
          outline: none;
          color: ${theme.palette.accents_6};
          border-left: 1px solid ${theme.palette.accents_2};
        }
        .active {
          color: ${theme.palette.link};
          font-weight: 500;
        }
        @keyframes fadeIn {
          from {
            transform: translate3d(0, 0.375rem, 0);
            opacity: 0;
          }
          to {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default MenuMobile
