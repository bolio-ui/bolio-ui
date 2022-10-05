import { Story, Meta } from '@storybook/react'
import Card from '.'
import Text from '../text'
import Grid from '../grid'
import Link from '../link'
import Image from '../image'
import Code from '../code'
import Divider from '../divider'

export default {
  title: 'Surface/Card',
  component: Card
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Card>A default card.</Card>
    </Grid>
  </Grid.Container>
)

export const Hover: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Card hoverable>A hover default card.</Card>
    </Grid>
  </Grid.Container>
)

export const Shadow: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Card shadow>
        <Text h4 my={0}>
          React is declarative
        </Text>
        <Text>
          React makes it painless to create interactive UIs. Design simple views
          for each state in your application, and React will efficiently update
          and render just the right components when your data changes.
        </Text>
        <Text>
          Declarative views make your code more predictable and easier to debug.
        </Text>
      </Card>
    </Grid>
  </Grid.Container>
)

export const Variants: Story = () => {
  const tuple = <T extends string[]>(...args: T) => args

  const types = tuple(
    'default',
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'dark',
    'lite',
    'info'
  )

  return (
    <Grid.Container gap={2}>
      {types.map((type) => (
        <Grid xs={6} md={4} key={type}>
          <Card type={type} width="100%">
            <Text h4 my={0} style={{ textTransform: 'uppercase' }}>
              {type}
            </Text>
            <Text>{type}</Text>
          </Card>
        </Grid>
      ))}
    </Grid.Container>
  )
}

export const WithFooter: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} justify="center">
      <Card width="100%">
        <Text h4 my={0}>
          Bolio UI
        </Text>
        <Text>More creative and fun with amazing features for React.</Text>
        <Card.Footer>
          <Link
            color
            target="_blank"
            href="https://github.com/bolio-ui/bolio-ui"
          >
            Visit source code on GitHub.
          </Link>
        </Card.Footer>
      </Card>
    </Grid>
    <Grid xs={12} justify="center">
      <Card width="100%" type="dark">
        <Text h4 my={0}>
          Bolio UI
        </Text>
        <Text>More creative and fun with amazing features for React.</Text>
        <Card.Footer>
          <Link target="_blank" href="https://github.com/bolio-ui/bolio-ui">
            Visit source code on GitHub.
          </Link>
        </Card.Footer>
      </Card>
    </Grid>
  </Grid.Container>
)

export const WithImage: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Card width="350px">
        <Image
          src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"
          width="350px"
          draggable={false}
        />
        <Text h4 mb={0} mt={0}>
          Bolio UI
        </Text>
        <Text type="secondary" small>
          More creative and fun with amazing features for React.
        </Text>
        <Card.Footer>
          <Link
            block
            target="_blank"
            href="https://github.com/bolio-ui/bolio-ui"
          >
            Visit source code on GitHub.
          </Link>
        </Card.Footer>
      </Card>
    </Grid>
  </Grid.Container>
)

export const WithDivider: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Card width="400px">
        <Card.Content>
          <Text b my={0}>
            A Simple Component
          </Text>
        </Card.Content>
        <Divider h="1px" my={0} />
        <Card.Content>
          <Text>
            React components implement a <Code>render()</Code> method that takes
            input data and returns what to display. This example uses an
            XML-like syntax called JSX. Input data that is passed into the
            component can be accessed by <Code>render()</Code> via{' '}
            <Code>this.props</Code>.
          </Text>
        </Card.Content>
      </Card>
    </Grid>
  </Grid.Container>
)
