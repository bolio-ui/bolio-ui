import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Textarea from '.'
import Grid from '../grid'
import Button from '../button'
import useInput from '../use-input'

export default {
  title: 'Data Entry/Textarea',
  component: Textarea
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Textarea placeholder="Enter a message." />
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Textarea
        width="100%"
        disabled
        placeholder="This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation on a separate page. Note that documentation for past versions is snapshotted at the time of the release, and isn’t being continuously updated."
      />
    </Grid>
  </Grid.Container>
)

export const Type: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Textarea type="success" height="65px" value="Success" />
    </Grid>
    <Grid>
      <Textarea type="secondary" height="65px" value="Secondary" />
    </Grid>
    <Grid>
      <Textarea type="warning" height="65px" value="Warning" />
    </Grid>
    <Grid>
      <Textarea type="error" height="65px" value="Error" />
    </Grid>
  </Grid.Container>
)

export const GetChange: Story = () => {
  const [value, setValue] = useState()
  const handler = (e) => {
    setValue(e.target.value)
    console.log(e.target.value)
  }
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Textarea
          width="100%"
          value={value}
          onChange={handler}
          placeholder="This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation on a separate page. Note that documentation for past versions is snapshotted at the time of the release, and isn’t being continuously updated."
        />
      </Grid>
    </Grid.Container>
  )
}

export const WithUseInput: Story = () => {
  const { setState, reset, bindings } = useInput(
    'This documentation always reflects the latest stable version of React. Since React 16, you can find older versions of the documentation on a separate page. Note that documentation for past versions is snapshotted at the time of the release, and isn’t being continuously updated.'
  )
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Textarea width="100%" {...bindings} />
      </Grid>
      <Grid>
        <Button
          auto
          type="secondary"
          scale={1 / 3}
          onClick={() => setState(Math.random().toString(32))}
        >
          insert value
        </Button>
      </Grid>
      <Grid>
        <Button auto scale={1 / 3} onClick={() => reset()}>
          clear value
        </Button>
      </Grid>
    </Grid.Container>
  )
}
