import Button from '../Button'
import Toolbar from '.'

export default function Example() {
  return (
    <Toolbar aria-label="Text formatting">
      <Button auto>Bold</Button>
      <Button auto>Italic</Button>
      <Toolbar.Separator />
      <Button auto>Link</Button>
    </Toolbar>
  )
}
