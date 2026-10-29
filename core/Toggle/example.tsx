import { useState } from 'react'
import Toggle from '.'

export default function Example() {
  const [on, setOn] = useState(false)

  return <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} />
}
