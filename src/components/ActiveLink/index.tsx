import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useTheme, Text, Link } from 'core'

export interface Props {
  onAcitve?: () => void
  href: string
  text: string
  target?: string
}

const ActiveLink: React.FC<Props> = React.memo(({ href, text, target }) => {
  const theme = useTheme()
  const router = useRouter()
  const isActive = router.asPath === href

  // Same behavior as the header Tabs: plain gray text (accents_5), hover only
  // brightens the text, and the current page gets a background. The accents
  // ramp runs the other way in light mode (3+ are text tones there).
  const activeBg =
    theme.type === 'dark' ? theme.palette.accents_4 : theme.palette.accents_2

  // color/background-color are declared ONLY in the stylesheet below (never
  // as inline style): an inline style for a property always wins over a
  // stylesheet's `:hover` rule for that same property, hover or not — that
  // silently defeated every earlier attempt at a hover effect here. Per-item
  // values travel in as CSS custom properties instead, which the shared,
  // identical-for-every-instance `:hover` rule reads via var().
  const label = (
    <Text
      p
      font="14px"
      my={0}
      mb={0.25}
      className="sidebar-item"
      style={
        {
          fontWeight: isActive ? 'bold' : undefined,
          cursor: 'pointer',
          display: 'block',
          textAlign: 'left',
          padding: '6px 12px',
          borderRadius: theme.layout.radius,
          transition: 'background-color 150ms ease, color 150ms ease',
          '--sidebar-item-color': isActive
            ? theme.palette.foreground
            : theme.palette.accents_5,
          '--sidebar-item-bg': isActive ? activeBg : 'transparent',
          '--sidebar-item-hover-color': theme.palette.foreground
        } as React.CSSProperties
      }
    >
      {text}
    </Text>
  )

  // the link fills the row, so the item starts on the category's left edge
  const linkStyle = { display: 'block', width: '100%', color: 'inherit' }

  if (target) {
    return (
      <Link href={href} target={target} style={linkStyle}>
        {label}
        <style jsx>{`
          :global(p.sidebar-item.sidebar-item) {
            color: var(--sidebar-item-color);
            background-color: var(--sidebar-item-bg);
          }
          :global(p.sidebar-item.sidebar-item:hover) {
            color: var(--sidebar-item-hover-color);
          }
        `}</style>
      </Link>
    )
  }

  return (
    <NextLink href={href} style={{ ...linkStyle, textDecoration: 'none' }}>
      {label}
      <style jsx>{`
        :global(p.sidebar-item.sidebar-item) {
          color: var(--sidebar-item-color);
          background-color: var(--sidebar-item-bg);
        }
        :global(p.sidebar-item.sidebar-item:hover) {
          color: var(--sidebar-item-hover-color);
        }
      `}</style>
    </NextLink>
  )
})

ActiveLink.displayName = 'BolioUIActiveLink'
export default ActiveLink
