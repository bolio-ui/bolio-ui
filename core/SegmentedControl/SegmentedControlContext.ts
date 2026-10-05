import React from 'react'

export type SegmentedControlValue = string | number

export interface SegmentedControlConfig {
  name?: string
  value?: SegmentedControlValue
  disabled: boolean
  select?: (value: SegmentedControlValue) => void
}

export const SegmentedControlContext =
  React.createContext<SegmentedControlConfig>({ disabled: false })

export const useSegmentedControlContext = (): SegmentedControlConfig =>
  React.useContext<SegmentedControlConfig>(SegmentedControlContext)
