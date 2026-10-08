import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Chip from '.'

export default {
  title: 'Data Entry/Chip',
  component: Chip
} as Meta

export const Default: StoryFn = () => <Chip>Free shipping</Chip>

export const Multiple: StoryFn = () => (
  <Chip.Group multiple initialValue={['react']} aria-label="Stack">
    <Chip value="react">React</Chip>
    <Chip value="vue">Vue</Chip>
    <Chip value="svelte">Svelte</Chip>
  </Chip.Group>
)

export const Single: StoryFn = () => (
  <Chip.Group initialValue={['m']} aria-label="Size">
    <Chip value="s">S</Chip>
    <Chip value="m">M</Chip>
    <Chip value="l">L</Chip>
  </Chip.Group>
)
