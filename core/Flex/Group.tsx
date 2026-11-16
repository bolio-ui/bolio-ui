import React from 'react'
import Flex from './Flex'
import type { FlexProps } from './Flex'

export interface GroupProps extends Omit<FlexProps, 'direction'> {
  // every child takes an equal share of the row
  grow?: boolean
}

// Children side by side, centered on the cross axis, wrapping when they do
// not fit.
const Group = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<GroupProps>
>(
  (
    { gap = 1, align = 'center', wrap = true, grow, children, ...props },
    ref
  ) => (
    <Flex ref={ref} gap={gap} align={align} wrap={wrap} {...props}>
      {grow
        ? React.Children.map(children, (child) =>
            React.isValidElement<{ style?: React.CSSProperties }>(child)
              ? React.cloneElement(child, {
                  style: { flex: 1, ...child.props.style }
                })
              : child
          )
        : children}
    </Flex>
  )
)

Group.displayName = 'BolioUIGroup'
export default Group
