import { useState } from 'react'
import Rating from '.'

export default function Example() {
  const [value, setValue] = useState(3)

  return <Rating value={value} onChange={setValue} />
}
