import { useState } from 'react'
import Dropzone from '.'

export default function Example() {
  const [names, setNames] = useState<string[]>([])

  return (
    <>
      <Dropzone
        multiple
        onDrop={(accepted) => setNames(accepted.map((file) => file.name))}
      />
      <p>{names.length ? names.join(', ') : 'No files yet.'}</p>
    </>
  )
}
