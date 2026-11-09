import { useState } from 'react'
import {
  Button,
  Container,
  Input,
  Modal,
  Page,
  Text,
  useToasts
} from '@bolio-ui/core'

// A small form that uses what is worth testing in Bolio UI: an Input with an
// error, a Modal in a portal and a toast.
function App() {
  const { setToast } = useToasts()
  const [email, setEmail] = useState('')
  const [invalid, setInvalid] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const submit = () => {
    const valid = /^\S+@\S+\.\S+$/.test(email)
    setInvalid(!valid)
    if (valid) setConfirming(true)
  }

  return (
    <Page>
      <Page.Content>
        <Container>
          <Text h2>Newsletter</Text>
          <Input
            width="100%"
            htmlType="email"
            placeholder="you@example.com"
            value={email}
            error={invalid}
            errorMessage="Enter an email like name@example.com"
            onChange={(event) => setEmail(event.target.value)}
          >
            Email
          </Input>
          <Button mt={1} type="primary" onClick={submit}>
            Subscribe
          </Button>
        </Container>
      </Page.Content>

      <Modal visible={confirming} onClose={() => setConfirming(false)}>
        <Modal.Title>Confirm subscription</Modal.Title>
        <Modal.Content>Send the newsletter to {email}?</Modal.Content>
        <Modal.Action passive onClick={(event) => event.close()}>
          Cancel
        </Modal.Action>
        <Modal.Action
          onClick={(event) => {
            setToast({ text: 'Subscribed', type: 'success' })
            event.close()
          }}
        >
          Confirm
        </Modal.Action>
      </Modal>
    </Page>
  )
}

export default App
