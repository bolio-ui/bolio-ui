import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import useTheme from '../use-theme'
import usePortal from '../utils/use-portal'
import useResize from '../utils/use-resize'
import useLatest from '../utils/use-latest'
import CssTransition from '../Shared/css-transition'
import useClickAnyWhere from '../utils/use-click-anywhere'
import { getColors } from './styles'
import {
  getPosition,
  TooltipPosition,
  defaultTooltipPosition
} from './placement'
import TooltipIcon from './TooltipIcon'
import { Placement, SnippetTypes } from '../utils/prop-types'
import useScale from '../use-scale'
import { getRect } from './helper'
import useClasses, { joinClasses } from '../use-classes'
import styles from './TooltipContent.module.css'

interface Props {
  parent?: MutableRefObject<HTMLElement | null> | undefined
  placement: Placement
  type: SnippetTypes
  visible: boolean
  hideArrow: boolean
  offset: number
  className?: string
  iconOffset: TooltipIconOffset
  id?: string
  role?: string
  light?: boolean
  ghost?: boolean
  subtle?: boolean
}
export type TooltipIconOffset = {
  x: string
  y: string
}

const TooltipContent: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  parent,
  visible,
  offset,
  iconOffset,
  placement,
  type,
  className,
  hideArrow,
  id,
  role,
  light = false,
  ghost = false,
  subtle = false
}) => {
  const theme = useTheme()
  const { SCALES } = useScale()

  const el = usePortal('tooltip')
  const selfRef = useRef<HTMLDivElement>(null)

  const [rect, setRect] = useState<TooltipPosition>(defaultTooltipPosition)
  const colors = useMemo(
    () => getColors(type, theme.palette, { light, ghost, subtle }),
    [type, theme.palette, light, ghost, subtle]
  )
  const hasShadow = type === 'default'
  const classes = useClasses(
    'tooltip-content',
    styles.tooltipContent,
    className
  )

  const updateRect = () => {
    const position = getPosition(placement, getRect(parent), offset)
    setRect(position)
  }

  useResize(updateRect)
  useClickAnyWhere(() => updateRect())

  const latestUpdate = useLatest(updateRect)
  useEffect(() => {
    latestUpdate.current()
  }, [visible, latestUpdate])

  // The trigger can sit inside a `position: fixed` header, whose viewport
  // position stays put while the page scrolls underneath it — but `getRect`
  // bakes in `scrollTop` to place the portal in document coordinates, so the
  // popover drifts away from a fixed trigger unless it's recomputed on every
  // scroll, not just on resize/click.
  useEffect(() => {
    if (!visible) return
    const handleScroll = () => latestUpdate.current()
    window.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: true
    })
    return () =>
      window.removeEventListener('scroll', handleScroll, { capture: true })
  }, [visible, latestUpdate])

  const preventHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
  }

  const contentStyle = {
    '--tooltip-icon-offset-x': iconOffset.x,
    '--tooltip-icon-offset-y': iconOffset.y,
    '--tooltip-content-bg': colors.bgColor,
    top: rect.top,
    left: rect.left,
    transform: rect.transform,
    color: colors.color,
    border: `1px solid ${colors.borderColor}`,
    borderRadius: theme.layout.radius,
    boxShadow: hasShadow ? theme.expressiveness.shadowMedium : 'none',
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto')
  } as React.CSSProperties

  const innerStyle: React.CSSProperties = {
    fontSize: SCALES.font(1),
    padding: `${SCALES.pt(0.65)} ${SCALES.pr(0.9)} ${SCALES.pb(0.65)} ${SCALES.pl(0.9)}`
  }

  if (!parent || !el) return null
  return createPortal(
    <CssTransition visible={visible}>
      <div
        id={id}
        role={role}
        className={classes}
        ref={selfRef}
        onClick={preventHandler}
        style={contentStyle}
      >
        <div className={joinClasses('inner', styles.inner)} style={innerStyle}>
          {!hideArrow && (
            <TooltipIcon placement={placement} shadow={hasShadow} />
          )}
          {children}
        </div>
      </div>
    </CssTransition>,
    el
  )
}

export default TooltipContent
