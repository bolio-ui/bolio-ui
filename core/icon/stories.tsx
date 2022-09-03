import { Story, Meta } from '@storybook/react'
import Card from '../card'
import Spacer from '../spacer'
import { Smile } from '@bolio-ui/icons'

export default {
  title: 'General/Icons',
  component: Card
} as Meta

export const Default: Story = () => (
  <Card>
    <Smile />
  </Card>
)

export const Colored: Story = () => (
  <Card>
    <Smile color="purple" />
  </Card>
)

export const Size: Story = () => (
  <Card>
    <Smile fontSize={16} /> <Spacer inline w={0.35} />
    <Smile fontSize={20} /> <Spacer inline w={0.35} />
    <Smile fontSize={24} /> <Spacer inline w={0.35} />
    <Smile fontSize={28} /> <Spacer inline w={0.35} />
    <Smile fontSize={32} /> <Spacer inline w={0.35} />
    <Smile fontSize={36} />
  </Card>
)
