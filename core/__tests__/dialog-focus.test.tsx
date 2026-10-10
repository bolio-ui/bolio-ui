import React, { useState } from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { Modal, Drawer } from '..'

// the focus goes to the dialog, so a screen reader says its name, and comes
// back to the button that opened it
const cases = [
  [
    'Modal',
    (visible: boolean) => (
      <Modal visible={visible} onClose={() => undefined}>
        <Modal.Title>Delete project</Modal.Title>
      </Modal>
    ),
    'Delete project'
  ],
  [
    'Drawer',
    (visible: boolean) => (
      <Drawer visible={visible} onClose={() => undefined} placement="right">
        <Drawer.Title>Edit profile</Drawer.Title>
      </Drawer>
    ),
    'Edit profile'
  ]
] as const

describe.each(cases)('%s focus', (_name, renderDialog, title) => {
  const Harness = () => {
    const [visible, setVisible] = useState(false)
    return (
      <>
        <button onClick={() => setVisible(true)}>Open</button>
        <button onClick={() => setVisible(false)}>Close from outside</button>
        {renderDialog(visible)}
      </>
    )
  }

  it('moves the focus to the dialog on open and gives it back on close', () => {
    render(<Harness />)
    const trigger = screen.getByText('Open')
    trigger.focus()
    fireEvent.click(trigger)
    const dialog = screen.getByRole('dialog', { name: title })
    expect(dialog).toHaveFocus()
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    act(() => {
      fireEvent.click(screen.getByText('Close from outside'))
    })
    expect(trigger).toHaveFocus()
  })
})
