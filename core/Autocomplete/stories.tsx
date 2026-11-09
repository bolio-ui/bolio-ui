import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Autocomplete from '.'

export default {
  title: 'Forms/Autocomplete',
  component: Autocomplete
} as Meta

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape']

export const Default: StoryFn = () => (
  <Autocomplete aria-label="Fruit" placeholder="Type a fruit" data={fruits} />
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState('')
  return (
    <Autocomplete
      aria-label="Fruit"
      data={fruits}
      value={value}
      onChange={setValue}
    />
  )
}
