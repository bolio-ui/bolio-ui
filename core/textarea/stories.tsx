import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Textarea from '.'
import Spacer from '../spacer'
import Button from '../button'
import useInput from '../use-input'

export default {
  title: 'Data Entry/Textarea',
  component: Textarea
} as Meta

export const Default: Story = () => <Textarea placeholder="Enter a message." />

export const Disabled: Story = () => (
  <Textarea
    width="100%"
    disabled
    placeholder="This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation on a separate page. Note that documentation for past versions is snapshotted at the time of the release, and isn’t being continuously updated."
  />
)

export const Type: Story = () => (
  <>
    <Textarea type="success" height="65px" value="Success" />
    <Spacer w={0.5} inline />
    <Textarea type="secondary" height="65px" value="Secondary" />
    <Spacer h={0.5} />
    <Textarea type="warning" height="65px" value="Warning" />
    <Spacer w={0.5} inline />
    <Textarea type="error" height="65px" value="Error" />
  </>
)

export const GetChange: Story = () => {
  const [value, setValue] = useState()

  const handler = (e: any) => {
    setValue(e.target.value)
    console.log(e.target.value)
  }

  return (
    <Textarea
      width="100%"
      value={value}
      onChange={handler}
      placeholder="This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation on a separate page. Note that documentation for past versions is snapshotted at the time of the release, and isn’t being continuously updated."
    />
  )
}

export const WithUseInput: Story = () => {
  const { setState, reset, bindings } = useInput(
    'This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation on a separate page. Note that documentation for past versions is snapshotted at the time of the release, and isn’t being continuously updated.'
  )

  return (
    <>
      <Textarea width="100%" {...bindings} />
      <Spacer h={0.5} />
      <Button
        auto
        type="secondary"
        scale={1 / 3}
        onClick={() => setState(Math.random().toString(32))}
      >
        insert value
      </Button>
      <Spacer h={0.5} />
      <Button auto scale={1 / 3} onClick={() => reset()}>
        clear value
      </Button>
    </>
  )
}
