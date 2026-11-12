import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import PhoneInput from '.'

export default {
  title: 'Data Entry/PhoneInput',
  component: PhoneInput
} as Meta

export const Default: StoryFn = () => <PhoneInput defaultCountry="BR" />

export const Controlled: StoryFn = () => {
  const [value, setValue] = React.useState('+351912345678')
  return <PhoneInput value={value} onChange={setValue} />
}
