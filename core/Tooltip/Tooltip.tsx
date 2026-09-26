import React, {
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import TooltipContent, { TooltipIconOffset } from './TooltipContent'
import useClickAway from '../utils/use-click-away'
import useLatest from '../utils/use-latest'
import { TriggerTypes, Placement, SnippetTypes } from '../utils/prop-types'
import { withScale } from '../use-scale'
import { getRect } from './helper'
import useClasses from '../use-classes'

export type TooltipOnVisibleChange = (visible: boolean) => void
export type TooltipTypes = SnippetTypes
export type TooltipTriggers = TriggerTypes
export type TooltipPlacement = Placement

interface Props {
  text?: string | React.ReactNode
  type?: TooltipTypes
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  placement?: TooltipPlacement
  visible?: boolean
  initialVisible?: boolean
  hideArrow?: boolean
  trigger?: TooltipTriggers
  enterDelay?: number
  leaveDelay?: number
  offset?: number
  className?: string
  portalClassName?: string
  onVisibleChange?: TooltipOnVisibleChange
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type TooltipProps = Props & NativeAttrs

// a child that takes focus by itself gets the aria attributes; anything else
// (text, a span) is wrapped by the tooltip's own element
const focusableTags = ['a', 'button', 'input', 'select', 'textarea']
const getFocusableChild = (children: React.ReactNode) => {
  if (!React.isValidElement<Record<string, unknown>>(children)) return null
  const { type } = children
  if (typeof type === 'string' && !focusableTags.includes(type)) return null
  return children
}

const TooltipComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<TooltipProps>
>(
  (
    {
      children,
      initialVisible = false,
      text = '',
      offset = 12,
      placement = 'top' as TooltipPlacement,
      portalClassName = '',
      enterDelay = 100,
      leaveDelay = 150,
      trigger = 'hover' as TooltipTriggers,
      type = 'default' as TooltipTypes,
      light = false,
      ghost = false,
      subtle = false,
      className = '',
      onVisibleChange = (() => {}) as TooltipOnVisibleChange,
      hideArrow = false,
      visible: customVisible,
      ...props
    },
    ref
  ) => {
    const timer = useRef<number | undefined>(undefined)
    const innerRef = useRef<HTMLDivElement>(null)
    const tooltipId = useId()
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement)

    const [visible, setVisible] = useState<boolean>(initialVisible)

    // measured again once the element is attached
    const triggerElement = innerRef.current
    const iconOffset = useMemo<TooltipIconOffset>(() => {
      if (!triggerElement) return { x: '0.75em', y: '0.75em' }
      const rect = getRect(innerRef)
      return {
        x: `${rect.width ? rect.width / 2 : 0}px`,
        y: `${rect.height ? rect.height / 2 : 0}px`
      }
    }, [triggerElement])

    const contentProps = {
      type,
      light,
      ghost,
      subtle,
      visible,
      offset,
      placement,
      hideArrow,
      iconOffset,
      parent: innerRef,
      className: portalClassName,
      id: tooltipId,
      role: trigger === 'hover' ? 'tooltip' : undefined
    }

    const changeVisible = (nextState: boolean) => {
      const clear = () => {
        clearTimeout(timer.current)
        timer.current = undefined
      }
      const handler = (nextState: boolean) => {
        setVisible(nextState)
        onVisibleChange(nextState)
        clear()
      }
      clear()
      if (nextState) {
        timer.current = window.setTimeout(() => handler(true), enterDelay)
        return
      }
      const leaveDelayWithoutClick = trigger === 'click' ? 0 : leaveDelay
      timer.current = window.setTimeout(
        () => handler(false),
        leaveDelayWithoutClick
      )
    }

    const mouseEventHandler = (next: boolean) =>
      trigger === 'hover' && changeVisible(next)
    const clickEventHandler = () =>
      trigger === 'click' && changeVisible(!visible)

    const focusableChild = getFocusableChild(children)
    const isWrapperButton = trigger === 'click' && !focusableChild

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape' && visible) changeVisible(false)
      if (!isWrapperButton || event.target !== event.currentTarget) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        changeVisible(!visible)
      }
    }

    const triggerProps =
      trigger === 'click'
        ? {
            'aria-expanded': visible,
            'aria-controls': visible ? tooltipId : undefined
          }
        : {
            'aria-describedby':
              [
                focusableChild?.props['aria-describedby'],
                visible ? tooltipId : undefined
              ]
                .filter(Boolean)
                .join(' ') || undefined
          }
    const wrapperProps = focusableChild
      ? {}
      : isWrapperButton
        ? { role: 'button', tabIndex: 0, ...triggerProps }
        : triggerProps

    useClickAway(innerRef, () => trigger === 'click' && changeVisible(false))
    // runs when `visible` changes, not on every render
    const latestChange = useLatest(changeVisible)
    useEffect(() => {
      if (customVisible === undefined) return
      latestChange.current(customVisible)
    }, [customVisible, latestChange])

    return (
      <div
        ref={innerRef}
        className={useClasses('tooltip', className)}
        onClick={clickEventHandler}
        onMouseEnter={() => mouseEventHandler(true)}
        onMouseLeave={() => mouseEventHandler(false)}
        onFocus={() => mouseEventHandler(true)}
        onBlur={() => mouseEventHandler(false)}
        onKeyDown={keyDownHandler}
        {...wrapperProps}
        {...props}
      >
        {focusableChild
          ? React.cloneElement(focusableChild, triggerProps)
          : children}
        <TooltipContent {...contentProps}>{text}</TooltipContent>
        <style jsx>{`
          .tooltip {
            width: max-content;
            display: inline-block;
          }
        `}</style>
      </div>
    )
  }
)

TooltipComponent.displayName = 'BolioUITooltip'
const Tooltip = withScale(TooltipComponent)
export default Tooltip
