import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Tooltip, { TooltipTypes } from '../Tooltip'
import { Placement, TriggerTypes } from '../utils/prop-types'
import { getReactNode } from '../utils/collections'
import useScale, { withScale } from '../use-scale'
import { PopoverContext, PopoverConfig } from './PopoverContext'
import useClasses from '../use-classes'
import useDefaultProps from '../utils/use-default-props'
import useLatest from '../utils/use-latest'

export type PopoverTriggerTypes = TriggerTypes
export type PopoverPlacement = Placement
export type TooltipOnVisibleChange = (visible: boolean) => void

interface Props {
  content?: React.ReactNode | (() => React.ReactNode)
  trigger?: PopoverTriggerTypes
  placement?: Placement
  disableItemsAutoClose?: boolean
  visible?: boolean
  onVisibleChange?: TooltipOnVisibleChange
}

const defaultProps = {
  disableItemsAutoClose: false,
  trigger: 'click' as PopoverTriggerTypes,
  placement: 'bottom' as Placement,
  portalClassName: '',
  initialVisible: false,
  hideArrow: false,
  type: 'default' as TooltipTypes,
  enterDelay: 100,
  leaveDelay: 150,
  offset: 12,
  className: '',
  onVisibleChange: (() => {}) as TooltipOnVisibleChange,
  visible: false as boolean
}

// type ExcludeTooltipProps = {
//   type: any
//   text: any
//   trigger: any
//   placement: any
// }

export type PopoverProps = Props

const PopoverComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<PopoverProps>
>((popoverProps, ref) => {
  const {
    content,
    children,
    trigger,
    placement,
    initialVisible,
    portalClassName,
    disableItemsAutoClose,
    onVisibleChange,
    visible: customVisible,
    type = 'default' as TooltipTypes,
    ...props
  } = useDefaultProps(popoverProps, defaultProps)
  const { SCALES } = useScale()
  const [visible, setVisible] = useState<boolean>(initialVisible)
  const textNode = useMemo(() => getReactNode(content), [content])
  const onPopoverVisibleChange = useCallback(
    (next: boolean) => {
      setVisible(next)
      onVisibleChange(next)
    },
    [onVisibleChange]
  )
  const onChildClick = useCallback(() => {
    onPopoverVisibleChange(false)
  }, [onPopoverVisibleChange])
  const value = useMemo<PopoverConfig>(
    () => ({
      onItemClick: onChildClick,
      disableItemsAutoClose
    }),
    [onChildClick, disableItemsAutoClose]
  )
  const classes = useClasses('popover', portalClassName)

  // runs when `visible` changes, not when the handler does
  const latestChange = useLatest(onPopoverVisibleChange)
  useEffect(() => {
    if (customVisible === undefined) return
    latestChange.current(customVisible)
  }, [customVisible, latestChange])

  return (
    <PopoverContext.Provider value={value}>
      <Tooltip
        ref={ref}
        initialVisible={false}
        text={textNode}
        trigger={trigger}
        placement={placement}
        portalClassName={classes}
        visible={visible}
        type={type}
        onVisibleChange={onPopoverVisibleChange}
        {...props}
      >
        {children}
      </Tooltip>
      <style jsx>{`
        :global(.tooltip-content.popover > .inner) {
          padding: ${SCALES.pt(0.9)} ${SCALES.pr(0)} ${SCALES.pb(0.9)}
            ${SCALES.pl(0)};
        }
      `}</style>
    </PopoverContext.Provider>
  )
})

PopoverComponent.displayName = 'BolioUIPopover'
const Popover = withScale(PopoverComponent)
export default Popover
