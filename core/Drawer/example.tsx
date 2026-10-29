import { useState } from 'react'
import Button from '../Button'
import Drawer from '.'

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open drawer</Button>
      <Drawer visible={open} onClose={() => setOpen(false)} placement="right">
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.Subtitle>Narrow down the list</Drawer.Subtitle>
        <Drawer.Content>The content of the drawer.</Drawer.Content>
      </Drawer>
    </>
  )
}
