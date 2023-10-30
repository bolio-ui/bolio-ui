import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import PaginationItem from './PaginationItem'
import PaginationEllipsis from './PaginationEllipsis'

interface Props {
  limit: number
  count: number
  current: number
  setPage: Dispatch<SetStateAction<number>>
}

function PaginationPages({ limit, count, current, setPage }: Props) {
  const showPages = useMemo(() => {
    const oddLimit = limit % 2 === 0 ? limit - 1 : limit
    return oddLimit - 2
  }, [limit])
  const middleNumber = (showPages + 1) / 2

  const [showBeforeEllipsis, showAfterEllipsis] = useMemo(() => {
    const showEllipsis = count > limit
    return [
      showEllipsis && current > middleNumber + 1,
      showEllipsis && current < count - middleNumber
    ]
  }, [current, middleNumber, count, limit])

  const pagesArray = useMemo(() => [...new Array(showPages)], [showPages])

  const renderItem = useCallback(
    (value: number, active: number) => (
      <PaginationItem
        key={`pagination-item-${value}`}
        active={value === active}
        onClick={() => setPage(value)}
      >
        {value}
      </PaginationItem>
    ),
    [setPage]
  )

  const startPages = pagesArray.map((_, index) => {
    const value = index + 2
    return renderItem(value, current)
  })

  const middlePages = pagesArray.map((_, index) => {
    const middleIndexNumber = middleNumber - (index + 1)
    const value = current - middleIndexNumber
    return (
      <PaginationItem
        key={`pagination-middle-${index}`}
        active={index + 1 === middleNumber}
        onClick={() => setPage(value)}
      >
        {value}
      </PaginationItem>
    )
  })

  const endPages = pagesArray.map((_, index) => {
    const value = count - (showPages - index)
    return renderItem(value, current)
  })

  if (count <= limit) {
    return (
      <>
        {[...new Array(count)].map((_, index) => {
          const value = index + 1
          return (
            <PaginationItem
              key={`pagination-item-${value}`}
              active={value === current}
              onClick={() => setPage(value)}
            >
              {value}
            </PaginationItem>
          )
        })}
      </>
    )
  }

  return (
    <>
      {renderItem(1, current)}
      {showBeforeEllipsis && (
        <PaginationEllipsis
          key="pagination-ellipsis-before"
          isBefore
          onClick={() => setPage((last) => (last - 5 >= 1 ? last - 5 : 1))}
        />
      )}
      {showBeforeEllipsis && showAfterEllipsis
        ? middlePages
        : showBeforeEllipsis
        ? endPages
        : startPages}
      {showAfterEllipsis && (
        <PaginationEllipsis
          key="pagination-ellipsis-after"
          onClick={() =>
            setPage((last) => (last + 5 <= count ? last + 5 : count))
          }
        />
      )}
      {renderItem(count, current)}
    </>
  )
}

PaginationPages.displayName = 'BolioUIPaginationPages'
export default PaginationPages
