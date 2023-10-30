import React from 'react'
import PaginationItem from './PaginationItem'
import { usePaginationContext } from './PaginationContext'

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
