import { Story, Meta } from '@storybook/react'
import Container from '.'
import Card from '../Card'
import Text from '../Text'

export default {
  title: 'Layout/Container',
  component: Container
} as Meta

export const Default: Story = () => (
  <Container>
    <Card>
      <Text>
        The Container limits the width of the page and centers its content.
        Resize the window to see it grow until the maximum width.
      </Text>
    </Card>
  </Container>
)

export const Fluid: Story = () => (
  <Container fluid>
    <Card>
      <Text>A fluid Container has no maximum width.</Text>
    </Card>
  </Container>
)

export const Aligned: Story = () => (
  <Container
    justify="center"
    align="middle"
    style={{ display: 'flex', height: 160 }}
  >
    <Card>
      <Text>justify and align work when the Container is a flex box.</Text>
    </Card>
  </Container>
)
