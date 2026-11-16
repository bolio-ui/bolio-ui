import React from 'react'
import Flex from './Flex'
import type { FlexProps } from './Flex'

export type StackProps = Omit<FlexProps, 'direction' | 'wrap'>

// Children one under the other, stretched to the full width.
const Stack = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<StackProps>
>(({ gap = 1, align = 'stretch', ...props }, ref) => (
  <Flex ref={ref} direction="column" gap={gap} align={align} {...props} />
))

Stack.displayName = 'BolioUIStack'
export default Stack
