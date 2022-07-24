import { Story, Meta } from '@storybook/react'
import Text from '.'

export default {
  title: 'General/Text',
  component: Text
} as Meta

export const Heading: Story = () => (
  <Text h1>Hello my friend, have fun with Bolio UI 🥷🏼</Text>
)

export const Paragraph: Story = () => (
  <>
    <Text p>
      Make your development more creative and with amazing tools for React.
    </Text>
    <Text p b>
      Make your development more creative and with amazing tools for React.
    </Text>
  </>
)

export const Small: Story = () => (
  <>
    <Text small>
      React makes it painless to create interactive UIs. Design simple views for
      each state in your application, and React will efficiently update and
      render just the right components when your data changes.
    </Text>
    <Text small i>
      React makes it painless to create interactive UIs. Design simple views for
      each state in your application, and React will efficiently update and
      render just the right components when your data changes.
    </Text>
  </>
)

export const Blockquote: Story = () => (
  <Text blockquote my={0}>
    Build encapsulated components that manage their own state, then compose them
    to make complex UIs.
  </Text>
)

export const Types: Story = () => (
  <Text b i style={{ letterSpacing: '0.6px' }}>
    <Text span type="success">
      Text colored
    </Text>
    <Text span type="warning">
      Text colored
    </Text>
    <Text span type="secondary">
      Text colored
    </Text>
    <Text span type="error">
      Text colored
    </Text>
    <Text span style={{ color: '#ccc' }}>
      Text colored
    </Text>
    <Text span type="success" ml="5px">
      Text colored
    </Text>
  </Text>
)

export const Sizes: Story = () => (
  <>
    <Text font="12px" mt={0}>
      Font Size: 12px;
    </Text>
    <Text font="14px">Font Size: 14px;</Text>
    <Text font="1rem">Font Size: 1rem;</Text>
    <Text scale={1.25} mb={0}>
      Font Size Scale: 1.25;
    </Text>
  </>
)

export const Compose: Story = () => (
  <>
    <Text p mt={0}>
      Build encapsulated components that manage their own state, then compose
      them to make complex UIs.
    </Text>
    <Text mb={0}>
      <Text small del>
        Since component logic is written in JavaScript instead of templates, you
        can easily pass rich data through your app and keep state out of the
        DOM.
      </Text>
      <Text small b>
        We don’t make assumptions about the rest of your technology stack, so
        you can develop new features in React without rewriting existing code.
      </Text>
    </Text>
  </>
)
