import React from 'react'
import { Avatar, Button, Tag, Text, useTheme } from 'core'
import { Muted } from './index'
import styles from './ThemeGallery.module.css'

export type NavEntry = {
  icon: React.ReactNode
  label: string
  tag?: string
  active?: boolean
}

export const NavItem: React.FC<NavEntry> = ({ icon, label, tag, active }) => {
  const theme = useTheme()
  return (
    <div
      className={styles.navItem}
      style={{
        background: active ? theme.palette.accents_2 : undefined,
        color: active ? theme.palette.foreground : theme.palette.accents_5,
        borderRadius: theme.layout.radius
      }}
    >
      {icon}
      <span className={styles.fill}>{label}</span>
      {tag && (
        <Tag type="primary" light>
          {tag}
        </Tag>
      )}
    </div>
  )
}

// An app frame: a sidebar with the user and the navigation, and the screen
// itself on the right, so each example reads as a real product.
export const Shell: React.FC<
  React.PropsWithChildren<{
    user: [string, string]
    nav: Array<NavEntry>
    extra?: React.ReactNode
    bottom?: React.ReactNode
  }>
> = ({ user, nav, extra, bottom, children }) => {
  const theme = useTheme()
  return (
    <div
      className={styles.app}
      style={{
        borderColor: theme.palette.border,
        borderRadius: `calc(${theme.layout.radius} + 8px)`
      }}
    >
      <aside
        className={styles.sidebar}
        style={{ borderColor: theme.palette.border }}
      >
        <div className={styles.row}>
          <Avatar text={user[0].slice(0, 2).toUpperCase()} />
          <div>
            <Text small b my={0}>
              {user[0]}
            </Text>
            <Muted>{user[1]}</Muted>
          </div>
        </div>
        <div className={styles.nav}>
          {nav.map((entry) => (
            <NavItem key={entry.label} {...entry} />
          ))}
        </div>
        {extra}
        <div className={styles.fill} />
        {bottom}
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  )
}

export const IconButton: React.FC<{
  icon: React.ReactNode
  label: string
  type?: 'error-light'
}> = ({ icon, label, type }) => (
  <Button auto scale={0.7} icon={icon} aria-label={label} type={type} />
)
