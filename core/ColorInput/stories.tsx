import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import ColorInput from '.'

export default {
  title: 'Data Entry/ColorInput',
  component: ColorInput
} as Meta

export const Default: StoryFn = () => (
  <ColorInput aria-label="Brand color" initialValue="#2563eb" />
)

export const Swatches: StoryFn = () => (
  <ColorInput
    aria-label="Label color"
    swatches={['#dc2626', '#f59e0b', '#16a34a', '#2563eb', '#7c3aed']}
  />
)

export const Controlled: StoryFn = () => {
  const [color, setColor] = useState('#f59e0b')
  return (
    <>
      <ColorInput aria-label="Color" value={color} onChange={setColor} />
      <p>{color}</p>
    </>
  )
}

export const Disabled: StoryFn = () => (
  <ColorInput aria-label="Color" disabled initialValue="#2563eb" />
)
