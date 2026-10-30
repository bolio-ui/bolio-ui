import { useState } from 'react'
import Pagination from '.'

export default function Example() {
  const [page, setPage] = useState(1)

  return <Pagination count={20} page={page} onChange={setPage} />
}
