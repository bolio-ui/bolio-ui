import Pagination from './Pagination'
import PaginationPrevious from './PaginationPrevious'
import PaginationNext from './PaginationNext'

export type PaginationComponentType = typeof Pagination & {
  Previous: typeof PaginationPrevious
  Next: typeof PaginationNext
}
;(Pagination as PaginationComponentType).Previous = PaginationPrevious
;(Pagination as PaginationComponentType).Next = PaginationNext

export type { PaginationProps } from './Pagination'
export type { PaginationPreviousProps } from './PaginationPrevious'
export type { PaginationNextProps } from './PaginationNext'
export default Pagination as PaginationComponentType
