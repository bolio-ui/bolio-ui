import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Spoiler from '.'
import Text from '../Text'

export default {
  title: 'Layout/Spoiler',
  component: Spoiler
} as Meta

const lines = [...Array(10)].map((_, i) => (
  <Text key={i} my={0.5}>
    Line {i + 1}
  </Text>
))

export const Default: StoryFn = () => <Spoiler maxHeight={80}>{lines}</Spoiler>

export const Short: StoryFn = () => (
  <Spoiler maxHeight={200}>
    <Text>Short content has no button.</Text>
  </Spoiler>
)
