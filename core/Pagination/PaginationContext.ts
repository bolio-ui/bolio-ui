import React from 'react'
export type PaginationUpdateType = 'prev' | 'next' | 'click'

export interface PaginationConfig {
  isFirst?: boolean
  isLast?: boolean
  update?: (type: PaginationUpdateType) => void
}

const defaultContext = {}

export const PaginationContext =
  React.createContext<PaginationConfig>(defaultContext)

export const usePaginationContext = (): PaginationConfig =>
  React.useContext<PaginationConfig>(PaginationContext)
