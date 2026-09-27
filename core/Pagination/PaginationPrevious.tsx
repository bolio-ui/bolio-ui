import React from 'react'
import PaginationItem from './PaginationItem'
import { usePaginationContext } from './PaginationContext'
import type { AnyElement } from '../utils/types'

export type PaginationPreviousProps = React.ButtonHTMLAttributes<AnyElement>

function PaginationPrevious({ children, ...props }: PaginationPreviousProps) {
  const { update, isFirst } = usePaginationContext()
  return (
    <PaginationItem
      onClick={() => update && update('prev')}
      disabled={isFirst}
      {...props}
    >
      {children}
    </PaginationItem>
  )
}

PaginationPrevious.displayName = 'BolioUIPaginationPrevious'
export default PaginationPrevious
