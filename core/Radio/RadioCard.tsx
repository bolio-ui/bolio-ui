import React from 'react'
import Radio from './Radio'
import type { RadioProps } from './Radio'
import OptionCard from '../Shared/option-card'

export type RadioCardProps = RadioProps

// A Radio inside a card. Put a Radio.Description in the children for the
// text under the title.
const RadioCard = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<RadioCardProps>
>(({ className = '', style, ...props }, ref) => (
  <OptionCard className={className} style={style}>
    <Radio ref={ref} {...props} />
  </OptionCard>
))

RadioCard.displayName = 'BolioUIRadioCard'
export default RadioCard
