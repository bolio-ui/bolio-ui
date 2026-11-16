import { useState } from 'react'
import Lightbox from '.'
import Button from '../Button'

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

export default function Example() {
  const [opened, setOpened] = useState(false)
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
