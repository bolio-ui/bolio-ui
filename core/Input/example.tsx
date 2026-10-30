import { useState } from 'react'
import Input from '.'

export default function Example() {
  const [email, setEmail] = useState('')

  return (
    <Input
      label="Email"
      placeholder="you@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  )
}
