import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Radio from '.'
import Spacer from '../spacer'

export default {
  title: 'Data Entry/Radio',
  component: Radio
} as Meta

export const Default: Story = () => <Radio checked={false}>Option 1</Radio>

export const Text: Story = () => {
  const [state, setState] = useState('1')
  const handler = (val: any) => {
    setState(val)
    console.log(val)
  }
  return (
    <>
      <Radio.Group value={state} onChange={handler}>
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </Radio.Group>
    </>
  )
}

export const Type: Story = () => (
  <>
    <Radio checked={false} type="default">
      Default
    </Radio>
    <Spacer h={0.5} />
    <Radio checked={false} type="success">
      Success
    </Radio>
    <Spacer h={0.5} />
    <Radio checked={false} type="warning">
      Warning
    </Radio>
    <Spacer h={0.5} />
    <Radio checked={false} type="error">
      Error
    </Radio>
  </>
)

export const Description: Story = () => (
  <Radio.Group value="1" onChange={(val) => console.log(val)}>
    <Radio value="1">
      Option 1
      <Radio.Description>Example description for Option 1</Radio.Description>
    </Radio>
  </Radio.Group>
)

export const Disabled: Story = () => (
  <Radio.Group value="1" disabled>
    <Radio value="1">Option 1</Radio>
    <Radio value="2">Option 2</Radio>
  </Radio.Group>
)

export const Row: Story = () => (
  <Radio.Group value="1" useRow>
    <Radio value="1">
      Option 1<Radio.Desc>Description for Option1</Radio.Desc>
    </Radio>
    <Radio value="2">
      Option 2<Radio.Desc>Description for Option2</Radio.Desc>
    </Radio>
  </Radio.Group>
)
