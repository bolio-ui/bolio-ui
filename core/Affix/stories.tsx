import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Affix from '.'
import Button from '../Button'

export default {
  title: 'Layout/Affix',
  component: Affix
} as Meta

export const BottomRight: StoryFn = () => (
  <Affix bottom={20} right={20}>
    <Button auto>Back to top</Button>
  </Affix>
)
