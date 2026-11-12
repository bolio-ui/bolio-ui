import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import RollingNumber from '.'
import Button from '../Button'

export default {
  title: 'Data Display/RollingNumber',
  component: RollingNumber
} as Meta

export const Default: StoryFn = () => {
  const [value, setValue] = React.useState(1280)
  return (
    <>
      <RollingNumber value={value} />{' '}
      <Button auto scale={0.6} onClick={() => setValue(value + 137)}>
        Add 137
      </Button>
    </>
  )
}

export const Currency: StoryFn = () => (
  <RollingNumber
    value={4820.5}
    formatOptions={{ style: 'currency', currency: 'USD' }}
  />
)
