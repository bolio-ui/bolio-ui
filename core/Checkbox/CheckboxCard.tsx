import React from 'react'
import Checkbox from './Checkbox'
import type { CheckboxProps } from './Checkbox'
import OptionCard from '../Shared/option-card'

export type CheckboxCardProps = CheckboxProps

// A Checkbox inside a card, where the whole card toggles it.
const CheckboxCard = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<CheckboxCardProps>
>(({ className = '', style, ...props }, ref) => (
  <OptionCard className={className} style={style}>
    <Checkbox ref={ref} {...props} />
  </OptionCard>
))

CheckboxCard.displayName = 'BolioUICheckboxCard'
export default CheckboxCard
