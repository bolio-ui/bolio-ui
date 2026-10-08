import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Toolbar from '.'
import Button from '../Button'

export default {
  title: 'Navigation/Toolbar',
  component: Toolbar
} as Meta

export const Default: StoryFn = () => (
  <Toolbar aria-label="Text formatting">
    <Button auto scale={0.75} subtle>
      Bold
    </Button>
    <Button auto scale={0.75} subtle>
      Italic
    </Button>
    <Toolbar.Separator />
    <Button auto scale={0.75} subtle>
      Link
    </Button>
  </Toolbar>
)
