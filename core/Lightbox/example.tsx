import { useState } from 'react'
import Lightbox from '.'
import Button from '../Button'

const images = [
  { src: '/cover.jpg', alt: 'The cover', caption: 'The cover of the docs' },
  { src: '/logo-colored.svg', alt: 'Colored logo' }
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
