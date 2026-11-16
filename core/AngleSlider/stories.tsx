import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import AngleSlider from '.'

export default {
  title: 'Data Entry/AngleSlider',
  component: AngleSlider
} as Meta

export const Default: StoryFn = () => (
  <AngleSlider aria-label="Angle" initialValue={45} />
)

export const Steps: StoryFn = () => {
  const [value, setValue] = React.useState(90)
  return (
    <AngleSlider
      aria-label="Angle"
      step={15}
      value={value}
      onChange={setValue}
    />
  )
}
