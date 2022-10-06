import { Story, Meta } from '@storybook/react'
import Text from '.'
import Grid from '../grid'

export default {
  title: 'General/Text',
  component: Text
} as Meta

export const Heading: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text h1>Hello my friend, have fun with Bolio UI 🥷🏼</Text>
    </Grid>
  </Grid.Container>
)

export const Paragraph: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text p>
        Make your development more creative and with amazing tools for React.
      </Text>
      <Text p b>
        Make your development more creative and with amazing tools for React.
      </Text>
    </Grid>
  </Grid.Container>
)

export const Small: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text small>
        React makes it painless to create interactive UIs. Design simple views
        for each state in your application, and React will efficiently update
        and render just the right components when your data changes.
      </Text>
      <Text small i>
        React makes it painless to create interactive UIs. Design simple views
        for each state in your application, and React will efficiently update
        and render just the right components when your data changes.
      </Text>
    </Grid>
  </Grid.Container>
)

export const Blockquote: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text blockquote my={0}>
        Build encapsulated components that manage their own state, then compose
        them to make complex UIs.
      </Text>
    </Grid>
  </Grid.Container>
)

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text b i style={{ letterSpacing: '0.6px' }}>
        <Grid>
          <Text span type="default">
            Text colored
          </Text>
        </Grid>
        <Grid>
          <Text span type="primary">
            Text colored
          </Text>
        </Grid>
        <Grid>
          <Text span type="secondary">
            Text colored
          </Text>
        </Grid>
        <Grid>
          <Text span type="success">
            Text colored
          </Text>
        </Grid>
        <Grid>
          <Text span type="warning">
            Text colored
          </Text>
        </Grid>
        <Grid>
          <Text span type="error">
            Text colored
          </Text>
        </Grid>
        <Grid>
          <Text span type="info">
            Text colored
          </Text>
        </Grid>
      </Text>
    </Grid>
  </Grid.Container>
)

export const Sizes: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text font="12px" mt={0}>
        Font Size: 12px;
      </Text>
      <Text font="14px">Font Size: 14px;</Text>
      <Text font="1rem">Font Size: 1rem;</Text>
      <Text scale={1.25} mb={0}>
        Font Size Scale: 1.25;
      </Text>
    </Grid>
  </Grid.Container>
)

export const Compose: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Text p mt={0}>
        Build encapsulated components that manage their own state, then compose
        them to make complex UIs.
      </Text>
      <Text mb={0}>
        <Text small del>
          Since component logic is written in JavaScript instead of templates,
          you can easily pass rich data through your app and keep state out of
          the DOM.
        </Text>
        <Text small b>
          We don’t make assumptions about the rest of your technology stack, so
          you can develop new features in React without rewriting existing code.
        </Text>
      </Text>
    </Grid>
  </Grid.Container>
)
