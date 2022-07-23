import { Story, Meta } from '@storybook/react'
import Link from '.'
import Spacer from '../spacer'
import Text from '../text'

export default {
  title: 'Navigation/Link',
  component: Link
} as Meta

export const Default: Story = () => (
  <Link href="#">HTTP is stateless, but not sessionless.</Link>
)

export const Highlight: Story = () => (
  <Link href="#" color>
    HTTP is stateless, but not sessionless.
  </Link>
)

export const WithIcon: Story = () => (
  <>
    <Link href="#" icon>
      HTTP is stateless, but not sessionless.
    </Link>
    <Spacer h={0.5} />
    <Link href="#" icon color>
      HTTP is stateless, but not sessionless.
    </Link>
  </>
)

export const Variant: Story = () => (
  <>
    <Text>
      <Link href="#">HTTP is stateless, but not sessionless.</Link>
    </Text>
    <Text>
      <Link href="#" color>
        HTTP is stateless, but not sessionless.
      </Link>
    </Text>
    <Text>
      <Link href="#" underline>
        HTTP is stateless, but not sessionless.
      </Link>
    </Text>
    <Text>
      <Link href="#" color underline>
        HTTP is stateless, but not sessionless.
      </Link>
    </Text>
  </>
)

export const Block: Story = () => (
  <Link href="#" block>
    HTTP is stateless, but not sessionless.
  </Link>
)
