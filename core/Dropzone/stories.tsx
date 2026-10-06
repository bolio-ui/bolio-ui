import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Dropzone from '.'

export default {
  title: 'Data Entry/Dropzone',
  component: Dropzone
} as Meta

export const Default: StoryFn = () => <Dropzone aria-label="Attachments" />

export const Images: StoryFn = () => {
  const [names, setNames] = useState<Array<string>>([])
  return (
    <>
      <Dropzone
        multiple
        accept="image/*"
        maxSize={2 * 1024 * 1024}
        onDrop={(accepted) => setNames(accepted.map((file) => file.name))}
      >
        Drop images up to 2 MB
      </Dropzone>
      <p>{names.join(', ') || 'Nothing yet'}</p>
    </>
  )
}

export const Disabled: StoryFn = () => (
  <Dropzone disabled>Uploads are off</Dropzone>
)

export const Thumbnails: StoryFn = () => (
  <Dropzone thumbnails multiple maxFiles={6} accept="image/*,.pdf,.csv,.zip">
    Drop images, PDFs, CSVs or ZIPs
  </Dropzone>
)
