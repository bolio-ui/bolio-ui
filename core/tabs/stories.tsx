import { Story, Meta } from '@storybook/react'
import Tabs from '.'
import Text from '../text'
import { Instagram, Facebook } from '@bolio-ui/icons'

export default {
  title: 'Navigation/Tabs',
  component: Tabs
} as Meta

export const Default: Story = () => (
  <Tabs initialValue="1">
    <Tabs.Item label="Declarative" value="1">
      React makes it painless to create interactive UIs. Design simple views for
      each state in your application, and React will efficiently update and
      render just the right components when your data changes.
    </Tabs.Item>
    <Tabs.Item label="Component-Based" value="2">
      Build encapsulated components that manage their own state, then compose
      them to make complex UIs.
    </Tabs.Item>
  </Tabs>
)

export const Disabled: Story = () => (
  <Tabs initialValue="1">
    <Tabs.Item label="Declarative" value="1">
      React makes it painless to create interactive UIs. Design simple views for
      each state in your application, and React will efficiently update and
      render just the right components when your data changes.
    </Tabs.Item>
    <Tabs.Item label="Component-Based" value="2" disabled />
  </Tabs>
)

export const HideDivider: Story = () => (
  <Tabs initialValue="react" hideDivider>
    <Tabs.Item label="Declarative" value="react">
      <Text mt={0}>
        React makes it painless to create interactive UIs. Design simple views
        for each state in your application, and React will efficiently update
        and render just the right components when your data changes.
      </Text>
    </Tabs.Item>
    <Tabs.Item label="Component-Based" value="component-based">
      <Text mt={0}>
        Build encapsulated components that manage their own state, then compose
        them to make complex UIs.
      </Text>
    </Tabs.Item>
  </Tabs>
)

export const HideBorder: Story = () => (
  <Tabs initialValue="react" hideDivider hideBorder leftSpace={0}>
    <Tabs.Item label="Declarative" value="react">
      <Text mt={0}>
        React makes it painless to create interactive UIs. Design simple views
        for each state in your application, and React will efficiently update
        and render just the right components when your data changes.
      </Text>
    </Tabs.Item>
    <Tabs.Item label="Component-Based" value="component-based">
      <Text mt={0}>
        Build encapsulated components that manage their own state, then compose
        them to make complex UIs.
      </Text>
    </Tabs.Item>
  </Tabs>
)

export const WithIcon: Story = () => (
  <Tabs initialValue="1" align="center" leftSpace={0}>
    <Tabs.Item
      label={
        <>
          <Instagram /> Instagram
        </>
      }
      value="1"
    >
      <Text mt={0}>Hello, this is my profile.</Text>
    </Tabs.Item>
    <Tabs.Item
      label={
        <>
          <Facebook /> Facebook
        </>
      }
      value="2"
    >
      <Text mt={0}>Hi, this is my page.</Text>
    </Tabs.Item>
  </Tabs>
)
