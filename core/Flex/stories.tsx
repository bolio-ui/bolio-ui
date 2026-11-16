import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Flex, { Stack, Group, Center, SimpleGrid } from '.'
import Button from '../Button'

export default {
  title: 'Layout/Flex',
  component: Flex
} as Meta

const buttons = ['One', 'Two', 'Three'].map((name) => (
  <Button key={name} auto>
    {name}
  </Button>
))

export const Default: StoryFn = () => (
  <Flex gap={1} justify="space-between">
    {buttons}
  </Flex>
)

export const StackStory: StoryFn = () => <Stack>{buttons}</Stack>
export const GroupStory: StoryFn = () => <Group>{buttons}</Group>
export const CenterStory: StoryFn = () => (
  <Center style={{ height: 120 }}>{buttons[0]}</Center>
)
export const SimpleGridStory: StoryFn = () => (
  <SimpleGrid cols={3}>{buttons}</SimpleGrid>
)
