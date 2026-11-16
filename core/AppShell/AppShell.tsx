import React from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import styles from './AppShell.module.css'

interface Props {
  // height of the whole shell, '100vh' fills the screen
  height?: number | string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type AppShellProps = Props & NativeAttrs

const AppShell = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<AppShellProps>
>(({ height = '100vh', className = '', style, ...props }, ref) => {
  const theme = useTheme()
  return (
    <div
      ref={ref}
      className={useClasses(styles.shell, className)}
      style={
        {
          height,
          '--shell-border': theme.palette.border,
          '--shell-bg': theme.palette.background,
          ...style
        } as React.CSSProperties
      }
      {...props}
    />
  )
})
AppShell.displayName = 'BolioUIAppShell'

interface SlotProps {
  className?: string
}

// One slot of the shell. A slot that is not rendered takes no room, because
// the grid tracks that hold only that slot collapse.
const createSlot = <E extends HTMLElement>(
  displayName: string,
  tag: 'header' | 'nav' | 'aside' | 'main' | 'footer',
  area: string,
  size?: 'height' | 'width'
) => {
  type SlotAllProps = SlotProps &
    Omit<React.HTMLAttributes<E>, keyof SlotProps | 'width' | 'height'> & {
      height?: number | string
      width?: number | string
    }
  const Slot = React.forwardRef<E, React.PropsWithChildren<SlotAllProps>>(
    ({ className = '', style, height, width, ...props }, ref) =>
      React.createElement(tag, {
        ref,
        className: `${styles[tag]} ${className}`.trim(),
        style: {
          gridArea: area,
          ...(size === 'height' && height !== undefined ? { height } : {}),
          ...(size === 'width' && width !== undefined ? { width } : {}),
          ...style
        },
        ...props
      })
  )
  Slot.displayName = displayName
  return Slot
}

export const AppShellHeader = createSlot<HTMLElement>(
  'BolioUIAppShellHeader',
  'header',
  'header',
  'height'
)
export const AppShellNavbar = createSlot<HTMLElement>(
  'BolioUIAppShellNavbar',
  'nav',
  'navbar',
  'width'
)
export const AppShellMain = createSlot<HTMLElement>(
  'BolioUIAppShellMain',
  'main',
  'main'
)
export const AppShellAside = createSlot<HTMLElement>(
  'BolioUIAppShellAside',
  'aside',
  'aside',
  'width'
)
export const AppShellFooter = createSlot<HTMLElement>(
  'BolioUIAppShellFooter',
  'footer',
  'footer',
  'height'
)

export default AppShell
