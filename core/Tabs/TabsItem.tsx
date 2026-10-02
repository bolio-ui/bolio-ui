import React, { useEffect, useMemo, useRef } from 'react'
import { TabsInternalCellProps, useTabsContext } from './TabsContext'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './TabsItem.module.css'

interface Props {
  label: string | React.ReactNode
  value: string
  disabled?: boolean
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type TabsItemProps = Props & NativeAttrs

// The header of one item. Tabs renders it, so it is in the first render
// (and in the server HTML); the scale props are the item's own.
type TabsItemCellProps = TabsInternalCellProps & Props

function TabsItemCellComponent({
  value,
  label,
  disabled = false,
  onClick,
  onMouseOver,
  activeClassName,
  activeStyle,
  hideBorder
}: TabsItemCellProps) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const ref = useRef<HTMLDivElement | null>(null)
  const { currentValue } = useTabsContext()
  const active = currentValue === value
  const classes = useClasses(
    styles.tab,
    {
      [styles.active]: active,
      [styles.disabled]: disabled,
      [styles.hideBorder]: hideBorder
    },
    active ? activeClassName : ''
  )

  const clickHandler = () => {
    if (disabled) return
    if (onClick) onClick(value)
  }

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      clickHandler()
      return
    }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    const tabs = Array.from(
      event.currentTarget.parentElement?.querySelectorAll<HTMLElement>(
        '[role="tab"]:not([aria-disabled="true"])'
      ) || []
    )
    const current = tabs.indexOf(event.currentTarget)
    const last = tabs.length - 1
    let next = current
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else if (event.key === 'ArrowRight')
      next = current === last ? 0 : current + 1
    else next = current === 0 ? last : current - 1
    event.preventDefault()
    tabs[next]?.focus()
    tabs[next]?.click()
  }

  const tabStyle = {
    '--tabs-item-color': theme.palette.accents_5,
    '--tabs-item-font-size': SCALES.font(0.875),
    '--tabs-item-width': SCALES.width(1, 'auto'),
    '--tabs-item-height': SCALES.height(1, 'auto'),
    '--tabs-item-padding-top': SCALES.pt(0.875),
    '--tabs-item-padding-right': SCALES.pr(0.55),
    '--tabs-item-padding-bottom': SCALES.pb(0.875),
    '--tabs-item-padding-left': SCALES.pl(0.55),
    '--tabs-item-margin-top': SCALES.mt(0),
    '--tabs-item-margin-right': SCALES.mr(0.2),
    '--tabs-item-margin-bottom': SCALES.mb(0),
    '--tabs-item-margin-left': SCALES.ml(0.2),
    '--tabs-item-hover-color': theme.palette.foreground,
    '--tabs-item-after-bg': theme.palette.foreground,
    '--tabs-item-active-color': theme.palette.foreground,
    '--tabs-item-disabled-color': theme.palette.accents_3,
    '--tabs-item-hide-border-content': label,
    '--tabs-item-focus-outline': theme.palette.primary,
    ...(active ? activeStyle : {})
  } as React.CSSProperties

  return (
    <div
      ref={ref}
      className={classes}
      role="tab"
      aria-selected={active}
      aria-disabled={disabled || undefined}
      tabIndex={active ? 0 : -1}
      onMouseOver={onMouseOver}
      onClick={clickHandler}
      onKeyDown={keyDownHandler}
      style={tabStyle}
      data-bolioui="tab-item"
    >
      {label}
    </div>
  )
}
TabsItemCellComponent.displayName = 'BolioUITabsInternalCell'
export const TabsItemCell = withScale(TabsItemCellComponent)

function TabsItemComponent({
  children,
  value,
  label,
  disabled = false
}: React.PropsWithChildren<TabsItemProps>) {
  const { getAllScaleProps } = useScale()
  const { register, currentValue, directValues } = useTabsContext()
  const isActive = useMemo(() => currentValue === value, [currentValue, value])
  // Tabs renders the header of its direct children by itself. An item nested
  // inside another component registers its header once it mounts.
  const isDirect = Boolean(directValues?.includes(value))

  useEffect(() => {
    if (isDirect || !register) return
    register({
      value,
      props: { value, label, disabled, ...getAllScaleProps() }
    })
    // register and getAllScaleProps are new functions on every render, and
    // registering changes the state of Tabs: they must not run this again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, label, disabled, isDirect])

  return isActive ? <>{children}</> : null
}

TabsItemComponent.displayName = 'BolioUITabsItem'
const TabsItem = withScale(TabsItemComponent)
export default TabsItem
