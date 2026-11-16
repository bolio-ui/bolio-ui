import React from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import { isDarkPalette } from '../utils/variant-colors'
import styles from './Timeline.module.css'

interface Props {
  title: React.ReactNode
  // date or time shown next to the title
  time?: React.ReactNode
  // replaces the default dot
  icon?: React.ReactNode
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLLIElement>, keyof Props>
export type TimelineItemProps = Props & NativeAttrs

const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.PropsWithChildren<TimelineItemProps>
>(({ title, time, icon, className = '', children, ...props }, ref) => {
  const theme = useTheme()
  return (
    <li
      ref={ref}
      className={useClasses(styles.item, className)}
      style={
        {
          '--timeline-line': isDarkPalette(theme.palette)
            ? theme.palette.accents_4
            : theme.palette.accents_3
        } as React.CSSProperties
      }
      {...props}
    >
      <span
        className={styles.marker}
        style={{
          color: theme.palette.foreground,
          backgroundColor: icon ? theme.palette.accents_2 : undefined
        }}
      >
        {icon || (
          <span
            className={styles.dot}
            style={{ backgroundColor: theme.palette.primary }}
          />
        )}
      </span>
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        {time && (
          <span
            className={styles.time}
            style={{ color: theme.palette.accents_5 }}
          >
            {time}
          </span>
        )}
      </div>
      {children && (
        <div className={styles.body} style={{ color: theme.palette.accents_5 }}>
          {children}
        </div>
      )}
    </li>
  )
})

TimelineItem.displayName = 'BolioUITimelineItem'
export default TimelineItem
