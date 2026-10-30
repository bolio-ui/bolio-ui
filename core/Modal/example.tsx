import { useState } from 'react'
import Button from '../Button'
import Modal from '.'

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete project</Button>
      <Modal visible={open} onClose={() => setOpen(false)}>
        <Modal.Title>Delete project</Modal.Title>
        <Modal.Content>This action cannot be undone.</Modal.Content>
        <Modal.Action passive onClick={() => setOpen(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action onClick={() => setOpen(false)}>Delete</Modal.Action>
      </Modal>
    </>
  )
}
