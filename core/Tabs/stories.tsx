import { Story, Meta } from '@storybook/react'
import Tabs from '.'
import Text from '../Text'
import Grid from '../Grid'
import { Instagram, Facebook } from '@bolio-ui/icons'

export default {
  title: 'Navigation/Tabs',
  component: Tabs
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tabs initialValue="1">
        <Tabs.Item label="Declarative" value="1">
          React makes it painless to create interactive UIs. Design simple views
          for each state in your application, and React will efficiently update
          and render just the right components when your data changes.
        </Tabs.Item>
        <Tabs.Item label="Component-Based" value="2">
          Build encapsulated components that manage their own state, then
          compose them to make complex UIs.
        </Tabs.Item>
      </Tabs>
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tabs initialValue="1">
        <Tabs.Item label="Declarative" value="1">
          React makes it painless to create interactive UIs. Design simple views
          for each state in your application, and React will efficiently update
          and render just the right components when your data changes.
        </Tabs.Item>
        <Tabs.Item label="Component-Based" value="2" disabled />
      </Tabs>
    </Grid>
  </Grid.Container>
)

export const HideDivider: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tabs initialValue="react" hideDivider>
        <Tabs.Item label="Declarative" value="react">
          <Text mt={0}>
            React makes it painless to create interactive UIs. Design simple
            views for each state in your application, and React will efficiently
            update and render just the right components when your data changes.
          </Text>
        </Tabs.Item>
        <Tabs.Item label="Component-Based" value="component-based">
          <Text mt={0}>
            Build encapsulated components that manage their own state, then
            compose them to make complex UIs.
          </Text>
        </Tabs.Item>
      </Tabs>
    </Grid>
  </Grid.Container>
)

export const HideBorder: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tabs initialValue="react" hideDivider hideBorder leftSpace={0}>
        <Tabs.Item label="Declarative" value="react">
          <Text mt={0}>
            React makes it painless to create interactive UIs. Design simple
            views for each state in your application, and React will efficiently
            update and render just the right components when your data changes.
          </Text>
        </Tabs.Item>
        <Tabs.Item label="Component-Based" value="component-based">
          <Text mt={0}>
            Build encapsulated components that manage their own state, then
            compose them to make complex UIs.
          </Text>
        </Tabs.Item>
      </Tabs>
    </Grid>
  </Grid.Container>
)

export const WithIcon: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
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
    </Grid>
  </Grid.Container>
)
