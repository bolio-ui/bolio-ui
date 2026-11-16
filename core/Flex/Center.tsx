import React from 'react'
import Flex from './Flex'
import type { FlexProps } from './Flex'

export type CenterProps = Omit<FlexProps, 'align' | 'justify'>

// Centers its content on both axes.
const Center = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<CenterProps>
>((props, ref) => <Flex ref={ref} align="center" justify="center" {...props} />)

Center.displayName = 'BolioUICenter'
export default Center
