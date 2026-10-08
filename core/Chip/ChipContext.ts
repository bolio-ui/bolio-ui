import React from 'react'

export type ChipValue = string

export interface ChipConfig {
  name?: string
  multiple: boolean
  value: Array<ChipValue>
  disabled: boolean
  toggle?: (value: ChipValue) => void
}

export const ChipContext = React.createContext<ChipConfig | null>(null)

export const useChipContext = (): ChipConfig | null =>
  React.useContext<ChipConfig | null>(ChipContext)
