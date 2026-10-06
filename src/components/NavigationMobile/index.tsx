import React from 'react'
import { useTheme, Text } from 'core'
import { ChevronRight } from '@bolio-ui/icons'
import { usePathname, useRouter } from 'next/navigation'
import { menuMobile } from 'src/data/menuMobile'
import { isPlainLeftClick } from 'src/utils/client-navigation'
import { versions } from 'src/data/versions'
import styles from './NavigationMobile.module.css'

interface Props {
  expanded: boolean
}

const MenuMobile: React.FC<Props> = ({ expanded }) => {
  const theme = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const navigate = (event: React.MouseEvent, url: string) => {
    if (!isPlainLeftClick(event)) return
    event.preventDefault()
    router.push(url)
  }
  const [expandedGroupName, setExpandedGroupName] = React.useState<
    string | null
  >(null)

  const handleGroupClick = (name: string) => {
    setExpandedGroupName(expandedGroupName === name ? null : name)
  }

  if (!expanded) return null

  return (
    <div
      className={styles.mobileMenu}
      style={
        {
          '--menu-page-margin': theme.layout.pageMargin,
          '--menu-gap': theme.layout.gap,
          '--menu-gap-half': theme.layout.gapHalf,
          '--menu-quarter': theme.layout.gapQuarter,
          '--menu-quarter-negative': theme.layout.gapQuarterNegative,
          '--menu-strong': theme.palette.accents_7,
          '--menu-muted': theme.palette.accents_6,
          '--menu-line': theme.palette.accents_2,
          '--menu-link': theme.palette.link
        } as React.CSSProperties
      }
    >
      <div>
        <Text ml={1}>Documentation</Text>

        {menuMobile.map((item, index) => (
          <div
            key={item.name}
            className={styles.fadein}
            style={{ animationDelay: `${(index + 1) * 50}ms` }}
          >
            <button
              className={`${styles.menuItem} ${
                expandedGroupName === item.name ? styles.expanded : ''
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
              <div className={styles.group}>
                {item.children.map((section) => (
                  <div key={section.name}>
                    <span className={styles.sectionName}>{section.name}</span>
                    {section.children.map((item) => {
                      const className = `${styles.sectionItem} ${
                        pathname === item.url ? styles.active : ''
                      }`
                      return item.target ? (
                        <a
                          key={item.url}
                          href={item.url || '/'}
                          target={item.target}
                          rel="noreferrer"
                          className={className}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <a
                          key={item.url}
                          href={item.url || '/'}
                          className={className}
                          onClick={(event) => navigate(event, item.url || '/')}
                        >
                          {item.name}
                        </a>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div
          className={styles.fadein}
          style={{ animationDelay: `${(menuMobile.length + 1) * 50}ms` }}
        >
          <div className={styles.group}>
            <span className={styles.sectionName}>Version</span>
            {versions.map(({ label, version, url, current }) => {
              const className = `${styles.sectionItem} ${current ? styles.active : ''}`
              const text = `${label} (v${version})`
              const ariaLabel = `Bolio UI ${label} documentation`
              return current ? (
                <a
                  href={url}
                  key={label}
                  className={className}
                  aria-label={ariaLabel}
                  onClick={(event) => navigate(event, url)}
                >
                  {text}
                </a>
              ) : (
                <a
                  href={url}
                  key={label}
                  target="_blank"
                  rel="noreferrer"
                  className={className}
                  aria-label={ariaLabel}
                >
                  {text}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuMobile
