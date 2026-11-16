import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Lightbox from '.'
import Button from '../Button'

export default {
  title: 'Overlay/Lightbox',
  component: Lightbox
} as Meta

const images = [
  { src: '/cover.jpg', alt: 'The cover', caption: 'The cover of the docs' },
  { src: '/logo-colored.svg', alt: 'Colored logo' }
]

export const Default: StoryFn = () => {
  const [opened, setOpened] = React.useState(false)
  return (
    <>
      <Button auto onClick={() => setOpened(true)}>
        Open gallery
      </Button>
      <Lightbox
        images={images}
        opened={opened}
        onClose={() => setOpened(false)}
      />
    </>
  )
}
