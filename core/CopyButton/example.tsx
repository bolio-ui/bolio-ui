import Button from '../Button'
import CopyButton from '.'

export default function Example() {
  return (
    <CopyButton value="yarn add @bolio-ui/core">
      {({ copied, copy }) => (
        <Button auto onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      )}
    </CopyButton>
  )
}
