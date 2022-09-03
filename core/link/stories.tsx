import { Story, Meta } from '@storybook/react'
import Link from '.'
import Spacer from '../spacer'
import Text from '../text'

export default {
  title: 'Navigation/Link',
  component: Link
} as Meta

export const Default: Story = () => (
  <Link href="#">
    Is a reference to the data you can follow directly by tapping.
  </Link>
)

export const Highlight: Story = () => (
  <Link href="#" color>
    Is a reference to the data you can follow directly by tapping.
  </Link>
)

export const WithIcon: Story = () => (
  <>
    <Link href="#" icon>
      Is a reference to the data you can follow directly by tapping.
    </Link>
    <Spacer h={0.5} />
    <Link href="#" icon color>
      Is a reference to the data you can follow directly by tapping.
    </Link>
  </>
)

export const Variant: Story = () => (
  <>
    <Text>
      <Link href="#">
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Text>
    <Text>
      <Link href="#" color>
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Text>
    <Text>
      <Link href="#" underline>
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Text>
    <Text>
      <Link href="#" color underline>
        Is a reference to the data you can follow directly by tapping.
      </Link>
    </Text>
  </>
)

export const Block: Story = () => (
  <Link href="#" block>
    Is a reference to the data you can follow directly by tapping.
  </Link>
)
