import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import List from '.'
import { Check } from '@bolio-ui/icons'

export default {
  title: 'Typography/List',
  component: List
} as Meta

export const Default: StoryFn = () => (
  <List>
    <List.Item>Unlimited projects</List.Item>
    <List.Item>Priority support</List.Item>
  </List>
)

export const Ordered: StoryFn = () => (
  <List type="ordered">
    <List.Item>Install the package</List.Item>
    <List.Item>Import the stylesheet</List.Item>
  </List>
)

export const WithIcon: StoryFn = () => (
  <List icon={<Check width={16} height={16} />}>
    <List.Item>Unlimited projects</List.Item>
    <List.Item>Priority support</List.Item>
  </List>
)
