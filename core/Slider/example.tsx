import { useState } from 'react'
import Slider from '.'

export default function Example() {
  const [value, setValue] = useState(40)

  return <Slider value={value} onChange={setValue} />
}
