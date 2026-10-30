import { useState } from 'react'
import Checkbox from '.'

export default function Example() {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
      Accept the terms
    </Checkbox>
  )
}
