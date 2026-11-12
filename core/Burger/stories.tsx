import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Burger from '.'

export default {
  title: 'Navigation/Burger',
  component: Burger
} as Meta

export const Default: StoryFn = () => {
  const [opened, setOpened] = React.useState(false)
  return (
    <Burger
      label={opened ? 'Close menu' : 'Open menu'}
      opened={opened}
      onClick={() => setOpened(!opened)}
    />
  )
}
