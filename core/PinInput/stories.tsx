import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import PinInput from '.'

export default {
  title: 'Data Entry/PinInput',
  component: PinInput
} as Meta

export const Default: StoryFn = () => <PinInput aria-label="Code" numeric />

export const Controlled: StoryFn = () => {
  const [code, setCode] = useState('12')
  return (
    <PinInput
      aria-label="Code"
      length={4}
      value={code}
      onChange={setCode}
      numeric
    />
  )
}

export const Masked: StoryFn = () => (
  <PinInput aria-label="PIN" length={4} mask numeric />
)

export const Error: StoryFn = () => (
  <PinInput aria-label="Code" error initialValue="123" />
)

export const Disabled: StoryFn = () => (
  <PinInput aria-label="Code" disabled initialValue="1234" />
)
