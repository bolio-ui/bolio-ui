import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Rating from '.'
import Grid from '../grid'
import Spacer from '../spacer'
import { Umbrella, Zap } from '@bolio-ui/icons'

export default {
  title: 'Feedback/Rating',
  component: Rating
} as Meta

export const Default: Story = () => {
  const [value, setValue] = useState(1)
  const [locked, setLocked] = useState(false)

  return (
    <Grid.Container gap={2}>
      <Grid xs={24} md={8} justify="center">
        <Rating
          onLockedChange={setLocked}
          value={value}
          onValueChange={setValue}
        />
      </Grid>
      <Grid xs={12} md={8} justify="center">
        Selection: {value}
      </Grid>
      <Grid xs={12} md={8} justify="center">
        Locked: {locked ? 'true' : 'false'}
      </Grid>
    </Grid.Container>
  )
}

export const Types: Story = () => {
  return (
    <Grid.Container gap={2} justify="center">
      <Grid xs={24} sm={24} md={8} justify="center">
        <Rating type="success" />
      </Grid>
      <Grid xs={24} sm={12} md={8} justify="center">
        <Rating type="error" />
      </Grid>
      <Grid xs={24} sm={12} md={8} justify="center">
        <Rating type="warning" />
      </Grid>
    </Grid.Container>
  )
}

export const CustomAmount: Story = () => {
  return (
    <>
      <Rating count={2} />
      <Spacer h={0.5} />
      <Rating value={3} count={6} />
      <Spacer h={0.5} />
      <Rating value={4} count={8} />
    </>
  )
}

export const Icon: Story = () => {
  return (
    <>
      <Rating value={4} count={6} type="success" icon={<Umbrella />} />
      <Spacer h={0.5} />
      <Rating count={7} type="error" icon={<Zap />} />
    </>
  )
}
