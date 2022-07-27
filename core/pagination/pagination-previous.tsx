import React from 'react'
import PaginationItem from './pagination-item'
import { usePaginationContext } from './pagination-context'

export type PaginationPreviousProps = React.ButtonHTMLAttributes<any>

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
