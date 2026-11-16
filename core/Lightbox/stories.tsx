import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Lightbox from '.'
import Button from '../Button'

export default {
  title: 'Overlay/Lightbox',
  component: Lightbox
} as Meta

const images = [
  {
    src: '/img/jpg/docs/lake-sunrise.jpg',
    alt: 'A mountain lake at sunrise',
    caption: 'Lake at sunrise'
  },
  {
    src: '/img/jpg/docs/forest-lake.jpg',
    alt: 'A forest lake under the clouds',
    caption: 'Forest lake'
  },
  {
    src: '/img/jpg/docs/autumn-canyon.jpg',
    alt: 'A river in a canyon in autumn',
    caption: 'Autumn canyon'
  }
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
