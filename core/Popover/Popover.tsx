import React, { useEffect, useMemo, useState } from 'react'
import Tooltip, {
  TooltipOnVisibleChange,
  TooltipProps,
  TooltipTypes
} from '../Tooltip'
import { Placement, TriggerTypes } from '../utils/prop-types'
import { getReactNode } from '../utils/collections'
import useScale, { withScale } from '../use-scale'
import { PopoverContext, PopoverConfig } from './PopoverContext'
import useClasses from '../use-classes'

export type PopoverTriggerTypes = TriggerTypes
export type PopoverPlacement = Placement

interface Props {
  content?: React.ReactNode | (() => React.ReactNode) | string
  trigger?: PopoverTriggerTypes
  placement?: Placement
  disableItemsAutoClose?: boolean
}

type ExcludeTooltipProps = {
  text: any
  trigger: any
  placement: any
}

export type PopoverProps = Props & Omit<TooltipProps, keyof ExcludeTooltipProps>

function PopoverComponent({
  content,
  children,
  disableItemsAutoClose = false,
  trigger = 'click' as PopoverTriggerTypes,
  placement = 'bottom' as Placement,
  portalClassName = '',
  type = 'default' as TooltipTypes,
  visible: customVisible,
  onVisibleChange = (() => {}) as TooltipOnVisibleChange,
  ...props
}: React.PropsWithChildren<PopoverProps>) {
  const { SCALES } = useScale()

  const [visible, setVisible] = useState<boolean>(false)
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

PopoverComponent.displayName = 'BolioUIPopover'
const Popover = withScale(PopoverComponent)
export default Popover
