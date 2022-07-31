import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Modal from '.'
import Button from '../button'
import useModal from '../use-modal'

export default {
  title: 'Feedback/Modal',
  component: Modal
} as Meta

export const Default: Story = () => {
  const [state, setState] = useState(false)
  const handler = () => setState(true)
  const closeHandler = (event: any) => {
    setState(false)
    console.log('closed')
  }
  return (
    <div>
      <Button auto onClick={handler}>
        Show Modal
      </Button>
      <Modal visible={state} onClose={closeHandler}>
        <Modal.Title>Modal</Modal.Title>
        <Modal.Subtitle>Example of a modal</Modal.Subtitle>
        <Modal.Content>
          <p>Demo content for the modal.</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setState(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action>Accepted</Modal.Action>
      </Modal>
    </div>
  )
}

export const UseModal: Story = () => {
  const { visible, setVisible, bindings } = useModal()
  return (
    <>
      <Button auto onClick={() => setVisible(true)}>
        Show Modal
      </Button>
      <Modal {...bindings}>
        <Modal.Title>Modal</Modal.Title>
        <Modal.Subtitle>Example of a modal</Modal.Subtitle>
        <Modal.Content>
          <p>Demo content for the modal.</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action>Accepted</Modal.Action>
      </Modal>
    </>
  )
}

export const WithoutActions: Story = () => {
  const [state, setState] = useState(false)
  const handler = () => setState(true)
  const closeHandler = (event: any) => {
    setState(false)
    console.log('closed')
  }
  return (
    <div>
      <Button auto onClick={handler}>
        Show Modal
      </Button>
      <Modal visible={state} onClose={closeHandler}>
        <Modal.Title>Modal</Modal.Title>
        <Modal.Subtitle>Example of a modal</Modal.Subtitle>
        <Modal.Content>
          <p>Demo content for the modal.</p>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export const Customized: Story = () => {
  const { setVisible, bindings } = useModal()
  return (
    <div>
      <Button auto onClick={() => setVisible(true)}>
        Show Modal
      </Button>
      <Modal width="35rem" {...bindings}>
        <Modal.Title>My Favorites</Modal.Title>
        <Modal.Content>
          <p>This is the width I want.</p>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export const Loading: Story = () => {
  const { visible, setVisible, bindings } = useModal()
  return (
    <>
      <Button auto onClick={() => setVisible(true)}>
        Show Modal
      </Button>
      <Modal {...bindings}>
        <Modal.Title>Modal</Modal.Title>
        <Modal.Subtitle>Example of a modal</Modal.Subtitle>
        <Modal.Content>
          <p>Demo content for the modal.</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action loading>Accepted</Modal.Action>
      </Modal>
    </>
  )
}

export const Overlong: Story = () => {
  const { visible, setVisible, bindings } = useModal()
  return (
    <>
      <Button auto onClick={() => setVisible(true)}>
        Show Modal
      </Button>
      <Modal {...bindings}>
        <Modal.Title>Modal</Modal.Title>
        <Modal.Subtitle>Modal with a very large content</Modal.Subtitle>
        <Modal.Content>
          <p>
            React has been designed from the start for gradual adoption, and you
            can use as little or as much React as you need. Whether you want to
            get a taste of React, add some interactivity to a simple HTML page,
            or start a complex React-powered app, the links in this section will
            help you get started.
          </p>
          <p>
            React has been designed from the start for gradual adoption, and you
            can use as little or as much React as you need. Whether you want to
            get a taste of React, add some interactivity to a simple HTML page,
            or start a complex React-powered app, the links in this section will
            help you get started.
          </p>
          <p>
            React has been designed from the start for gradual adoption, and you
            can use as little or as much React as you need. Whether you want to
            get a taste of React, add some interactivity to a simple HTML page,
            or start a complex React-powered app, the links in this section will
            help you get started.
          </p>
          <p>
            React has been designed from the start for gradual adoption, and you
            can use as little or as much React as you need. Whether you want to
            get a taste of React, add some interactivity to a simple HTML page,
            or start a complex React-powered app, the links in this section will
            help you get started.
          </p>
          <p>
            React has been designed from the start for gradual adoption, and you
            can use as little or as much React as you need. Whether you want to
            get a taste of React, add some interactivity to a simple HTML page,
            or start a complex React-powered app, the links in this section will
            help you get started.
          </p>
          <p>
            React has been designed from the start for gradual adoption, and you
            can use as little or as much React as you need. Whether you want to
            get a taste of React, add some interactivity to a simple HTML page,
            or start a complex React-powered app, the links in this section will
            help you get started.
          </p>
          <p>
            React has been designed from the start for gradual adoption, and you
            can use as little or as much React as you need. Whether you want to
            get a taste of React, add some interactivity to a simple HTML page,
            or start a complex React-powered app, the links in this section will
            help you get started.
          </p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action>Accepted</Modal.Action>
      </Modal>
    </>
  )
}
