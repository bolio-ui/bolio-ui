import React from 'react'
import cn from 'classnames'
import { useTheme } from 'core'
import { Heading } from 'src/utils/get-headings'
import { useScrollSpy } from 'src/utils/use-scroll-spy'
import styles from './SidebarHeading.module.css'

interface SidebarHeadingProps {
  headings: Heading[]
}

function Sidebar({ headings, ...props }: SidebarHeadingProps) {
  const theme = useTheme()

  const activeId = useScrollSpy(headings.map(({ id }) => id))

  if (headings.length <= 0) return null

  return (
    <div
      className={styles.container}
      style={
        {
          '--heading-link-color': theme.palette.accents_6,
          '--heading-active-color': theme.palette.accents_8,
          '--heading-dot-color': theme.palette.accents_7
        } as React.CSSProperties
      }
      {...props}
    >
      <span className={styles.title}>Contents</span>
      <ul className={styles.list}>
        {headings.map((heading, i) => (
          <li
            key={i}
            className={cn(styles.listItem, {
              [styles.active]: activeId == heading.id
            })}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
