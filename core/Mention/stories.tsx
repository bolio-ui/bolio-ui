import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Mention from '.'

export default {
  title: 'Data Entry/Mention',
  component: Mention
} as Meta

const people = [
  { value: 'ana', label: 'Ana Souza' },
  { value: 'bruno', label: 'Bruno Lima' },
  { value: 'carla', label: 'Carla Dias' }
]

export const Default: StoryFn = () => (
  <Mention
    options={people}
    placeholder="Write a comment and type @ to mention someone"
  />
)
