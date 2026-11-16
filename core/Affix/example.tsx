import Affix from '.'
import Button from '../Button'

export default function Example() {
  return (
    <Affix bottom={20} right={20}>
      <Button auto>Back to top</Button>
    </Affix>
  )
}
