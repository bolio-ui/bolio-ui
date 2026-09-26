import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, Drawer, Modal } from '..'

const backdrop = () => document.querySelector('.backdrop') as HTMLElement

// A click is not always a pointer click: Enter or Space on a focused button,
// and element.click(), send a click with no mousedown before it. Inside the
// content it is not a click on the backdrop, and must not close.
describe('a Modal closes from its backdrop, not from its content', () => {
  const setup = (props: Partial<React.ComponentProps<typeof Modal>> = {}) => {
    const onClose = jest.fn()
    render(
      <BolioUIProvider>
        <Modal visible onClose={onClose} {...props}>
          <Modal.Title>Title</Modal.Title>
          <Modal.Action onClick={() => undefined}>Save</Modal.Action>
          <Modal.Action onClick={(event) => event.close()}>Close</Modal.Action>
        </Modal>
      </BolioUIProvider>
    )
    return onClose
  }

  it('does not close when a button inside is activated without a mousedown', () => {
    const onClose = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes once when an action asks for it', () => {
    const onClose = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when the backdrop is clicked', () => {
    const onClose = setup()
    fireEvent.click(backdrop())
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when it is clicked with disableBackdropClick', () => {
    const onClose = setup({ disableBackdropClick: true })
    fireEvent.click(backdrop())
    expect(onClose).not.toHaveBeenCalled()
  })

  it('does not close when the pointer went down inside and up on the backdrop', () => {
    const onClose = setup()
    fireEvent.mouseDown(screen.getByRole('dialog'))
    fireEvent.mouseUp(backdrop())
    fireEvent.click(backdrop())
    expect(onClose).not.toHaveBeenCalled()
  })
})

describe('a Drawer closes from its backdrop, not from its content', () => {
  const setup = () => {
    const onClose = jest.fn()
    render(
      <BolioUIProvider>
        <Drawer visible placement="right" onClose={onClose}>
          <button>Inside</button>
        </Drawer>
      </BolioUIProvider>
    )
    return onClose
  }

  it('does not close when a button inside is activated without a mousedown', () => {
    const onClose = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Inside' }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes when the backdrop is clicked', () => {
    const onClose = setup()
    fireEvent.click(backdrop())
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
