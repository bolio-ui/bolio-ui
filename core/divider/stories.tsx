import { Story, Meta } from '@storybook/react'
import Divider from '.'
import Text from '../text'

export default {
  title: 'Others/Divider',
  component: Divider
} as Meta

export const Default: Story = () => (
  <>
    <Text>
      React makes it painless to create interactive UIs. Design simple views for
      each state in your application, and React will efficiently update and
      render just the right components when your data changes.
    </Text>
    <Divider />
    <Text>
      Declarative views make your code more predictable and easier to debug.
    </Text>
  </>
)

export const WithText: Story = () => (
  <>
    <Text>
      React makes it painless to create interactive UIs. Design simple views for
      each state in your application, and React will efficiently update and
      render just the right components when your data changes.
    </Text>
    <Divider>A Simple Component</Divider>
    <Text>
      React components implement a render() method that takes input data and
      returns what to display. This example uses an XML-like syntax called JSX.
      Input data that is passed into the component can be accessed by render()
      via this.props.
    </Text>
    <Divider align="start">A Stateful Component</Divider>
    <Text>
      In addition to taking input data (accessed via this.props), a component
      can maintain internal state data (accessed via this.state). When a
      component’s state data changes, the rendered markup will be updated by
      re-invoking render().
    </Text>
  </>
)

export const Space: Story = () => (
  <>
    <Text>
      React makes it painless to create interactive UIs. Design simple views for
      each state in your application, and React will efficiently update and
      render just the right components when your data changes.
    </Text>
    <Divider h={5}>A Simple Component</Divider>
    <Text>
      React components implement a render() method that takes input data and
      returns what to display. This example uses an XML-like syntax called JSX.
      Input data that is passed into the component can be accessed by render()
      via this.props.
    </Text>
    <Divider my={5} h={5}>
      A Stateful Component
    </Divider>
    <Text>
      In addition to taking input data (accessed via this.props), a component
      can maintain internal state data (accessed via this.state). When a
      component’s state data changes, the rendered markup will be updated by
      re-invoking render().
    </Text>
  </>
)

export const Types: Story = () => (
  <>
    <Text>
      React makes it painless to create interactive UIs. Design simple views for
      each state in your application, and React will efficiently update and
      render just the right components when your data changes.
    </Text>
    <Divider h={3} type="success">
      A Simple Component
    </Divider>
    <Text>
      React components implement a render() method that takes input data and
      returns what to display. This example uses an XML-like syntax called JSX.
      Input data that is passed into the component can be accessed by render()
      via this.props.
    </Text>
    <Divider h={3} my={3} type="warning">
      A Stateful Component
    </Divider>
    <Text>
      In addition to taking input data (accessed via this.props), a component
      can maintain internal state data (accessed via this.state). When a
      component’s state data changes, the rendered markup will be updated by
      re-invoking render().
    </Text>
  </>
)
