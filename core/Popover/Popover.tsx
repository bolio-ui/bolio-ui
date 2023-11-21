import React, { useEffect, useMemo, useState } from 'react'
import Tooltip, { TooltipTypes } from '../Tooltip'
import { Placement, TriggerTypes } from '../utils/prop-types'
import { getReactNode } from '../utils/collections'
import useScale, { withScale } from '../use-scale'
import { PopoverContext, PopoverConfig } from './PopoverContext'
import useClasses from '../use-classes'

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

const PopoverComponent: React.FC<React.PropsWithChildren<PopoverProps>> = ({
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
}: React.PropsWithChildren<PopoverProps> & typeof defaultProps) => {
  const { SCALES } = useScale()
  const [visible, setVisible] = useState<boolean>(initialVisible)
  const textNode = useMemo(() => getReactNode(content), [content])
  const onChildClick = () => {
    onPopoverVisibleChange(false)
  }
  const value = useMemo<PopoverConfig>(
    () => ({
      onItemClick: onChildClick,
      disableItemsAutoClose
    }),
    [disableItemsAutoClose]
  )
  const classes = useClasses('popover', portalClassName)

  const onPopoverVisibleChange = (next: boolean) => {
    setVisible(next)
    onVisibleChange(next)
  }

  useEffect(() => {
    if (customVisible === undefined) return
    onPopoverVisibleChange(customVisible)
  }, [customVisible])

  return (
    <PopoverContext.Provider value={value}>
      <Tooltip
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
        <style jsx>{`
          :global(.tooltip-content.popover > .inner) {
            padding: ${SCALES.pt(0.9)} ${SCALES.pr(0)} ${SCALES.pb(0.9)}
              ${SCALES.pl(0)};
          }
        `}</style>
      </Tooltip>
    </PopoverContext.Provider>
  )
}

PopoverComponent.defaultProps = defaultProps
PopoverComponent.displayName = 'BolioUIPopover'
const Popover = withScale(PopoverComponent)
export default Popover
