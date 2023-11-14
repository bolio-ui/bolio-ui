import React from 'react'
import NextLink from 'next/link'
import { useTheme, Text } from 'core'
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
        <Text className={`fadein ${pathname === `/` ? 'active' : ''}`} ml={1}>
          Documentation
        </Text>

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
          top: 60px;
          z-index: 1001;
          right: 0;
          left: 0;
          bottom: 0;
          display: block;
          margin: 0;
          width: 100%;
          /* height: 100vh; */
          -webkit-transition: height.25s ease;
          -moz-transition: height.25s ease;
          -o-transition: height.25s ease;
          transition: height.25s ease;
          will-change: height;
          overflow-y: scroll;
          overflow-x: hidden;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;

          backdrop-filter: saturate(180%) blur(40px);
          transition: box-shadow 1s ease;
          transition: backdrop-filter 1s ease;
        }
        .fadein {
          animation: fadeIn 200ms ease;
          animation-fill-mode: forwards;
          opacity: 0;
        }
        .menu-item {
          padding: 0 ${theme.layout.pageMargin};
          height: 48px;
          width: 100%;
          display: flex;
          align-items: center;
          border: none;
          background: none;
          outline: none;
          /* border-bottom: 1px solid ${theme.palette.accents_2}; */
          text-transform: capitalize;
          color: ${theme.palette.accents_7};
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
          /* background: ${theme.palette.accents_1}; */
          padding: 1px ${theme.layout.gap} ${theme.layout.gap}
            calc(${theme.layout.gap} * 1.5);
        }
        .section-name {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: ${theme.palette.accents_7};
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
