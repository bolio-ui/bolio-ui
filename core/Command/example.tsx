import { useState } from 'react'
import Button from '../Button'
import Command from '.'

const items = [
  { value: 'home', label: 'Go to home', onSelect: () => console.log('home') },
  {
    value: 'settings',
    label: 'Open settings',
    hint: 'G S',
    onSelect: () => console.log('settings')
  }
]

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open command</Button>
      <Command visible={open} onClose={() => setOpen(false)} items={items} />
    </>
  )
}
