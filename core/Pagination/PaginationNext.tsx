import React from 'react'
import PaginationItem from './PaginationItem'
import { usePaginationContext } from './PaginationContext'
import type { AnyElement } from '../utils/types'

export type PaginationNextProps = React.ButtonHTMLAttributes<AnyElement>

function PaginationNext({ children, ...props }: PaginationNextProps) {
  const { update, isLast } = usePaginationContext()
  return (
    <PaginationItem
      onClick={() => update && update('next')}
      disabled={isLast}
      {...props}
    >
      {children}
    </PaginationItem>
  )
}

PaginationNext.displayName = 'BolioUIPaginationNext'
export default PaginationNext
