import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import ColorPicker from '.'

export default {
  title: 'Data Entry/ColorPicker',
  component: ColorPicker
} as Meta

export const Default: StoryFn = () => (
  <ColorPicker aria-label="Brand color" initialValue="#2563eb" />
)

export const Swatches: StoryFn = () => (
  <ColorPicker
    aria-label="Label color"
    initialValue="#16a34a"
    swatches={['#dc2626', '#f59e0b', '#16a34a', '#2563eb', '#7c3aed']}
  />
)

export const Controlled: StoryFn = () => {
  const [color, setColor] = useState('#f59e0b')
  return (
    <>
      <ColorPicker aria-label="Color" value={color} onChange={setColor} />
      <p>{color}</p>
    </>
  )
}

export const Disabled: StoryFn = () => (
  <ColorPicker aria-label="Color" disabled initialValue="#2563eb" />
)
