import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Tour from '.'
import Button from '../Button'

export default {
  title: 'Overlay/Tour',
  component: Tour
} as Meta

export const Default: StoryFn = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button id="tour-start" auto onClick={() => setOpen(true)}>
        Start the tour
      </Button>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={[
          {
            target: '#tour-start',
            title: 'The button',
            content: 'This is where the tour starts.'
          },
          { title: 'No target', content: 'A step can point at nothing.' }
        ]}
      />
    </>
  )
}
