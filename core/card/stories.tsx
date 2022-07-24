import { Story, Meta } from '@storybook/react'
import Card from '.'

export default {
  title: 'Surface/Card',
  component: Card
} as Meta

export const Default: Story = () => (
  <Card>
    <p>A default card.</p>
  </Card>
)
