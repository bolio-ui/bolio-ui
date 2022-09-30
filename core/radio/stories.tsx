import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Radio from '.'
import Grid from '../grid'

export default {
  title: 'Data Entry/Radio',
  component: Radio
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Radio checked={false}>Option 1</Radio>
    </Grid>
  </Grid.Container>
)

export const Text: Story = () => {
  const [state, setState] = useState('1')
  const handler = (val) => {
    setState(val)
    console.log(val)
  }
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Radio.Group value={state} onChange={handler}>
          <Radio value="1">Option 1</Radio>
          <Radio value="2">Option 2</Radio>
        </Radio.Group>
      </Grid>
    </Grid.Container>
  )
}

export const Type: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Radio checked={false} type="default">
        Default
      </Radio>
    </Grid>
    <Grid>
      <Radio checked={false} type="success">
        Success
      </Radio>
    </Grid>
    <Grid>
      <Radio checked={false} type="warning">
        Warning
      </Radio>
    </Grid>
    <Grid>
      <Radio checked={false} type="error">
        Error
      </Radio>
    </Grid>
  </Grid.Container>
)

export const Description: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Radio.Group value="1" onChange={(val) => console.log(val)}>
        <Radio value="1">
          Option 1
          <Radio.Description>
            Example description for Option 1
          </Radio.Description>
        </Radio>
      </Radio.Group>
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Radio.Group value="1" disabled>
        <Radio value="1">Option 1</Radio>
        <Radio value="2">Option 2</Radio>
      </Radio.Group>
    </Grid>
  </Grid.Container>
)

export const Row: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Radio.Group value="1" useRow>
        <Radio value="1">
          Option 1<Radio.Desc>Description for Option1</Radio.Desc>
        </Radio>
        <Radio value="2">
          Option 2<Radio.Desc>Description for Option2</Radio.Desc>
        </Radio>
      </Radio.Group>
    </Grid>
  </Grid.Container>
)
