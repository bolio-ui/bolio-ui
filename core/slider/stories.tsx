import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Slider from '.'
import Spacer from '../spacer'

export default {
  title: 'Data Entry/Slider',
  component: Slider
} as Meta

export const Default: Story = () => <Slider initialValue={40} />

export const Type: Story = () => (
  <>
    <Slider type="default" initialValue={40} />
    <Spacer />
    <Slider type="success" initialValue={60} />
    <Spacer />
    <Slider type="warning" initialValue={10} />
    <Spacer />
    <Slider type="error" initialValue={80} />
  </>
)

export const Disabled: Story = () => <Slider initialValue={50} disabled />

export const Markers: Story = () => <Slider step={10} showMarkers width="75%" />

export const Range: Story = () => (
  <>
    <Slider
      step={5}
      max={50}
      min={10}
      initialValue={25}
      showMarkers
      width="75%"
    />
    <Spacer />
    <Slider
      step={0.2}
      max={1}
      min={0.2}
      initialValue={0.4}
      showMarkers
      width="75%"
    />
  </>
)

export const Event: Story = () => {
  const [value, setValue] = useState()
  const handler = (val: any) => {
    console.log(val)
    setValue(val)
  }
  return <Slider value={value} onChange={handler} width="50%" />
}
