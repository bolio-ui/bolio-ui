import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Rating from '.'
import Grid from '../grid'
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
      <Grid>
        <Rating
          onLockedChange={setLocked}
          value={value}
          onValueChange={setValue}
        />
      </Grid>
      <Grid>Selection: {value}</Grid>
      <Grid>Locked: {locked ? 'true' : 'false'}</Grid>
    </Grid.Container>
  )
}

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Rating />
    </Grid>
    <Grid>
      <Rating type="primary" />
    </Grid>
    <Grid>
      <Rating type="secondary" />
    </Grid>
    <Grid>
      <Rating type="success" />
    </Grid>
    <Grid>
      <Rating type="error" />
    </Grid>
    <Grid>
      <Rating type="warning" />
    </Grid>
    <Grid>
      <Rating type="info" />
    </Grid>
  </Grid.Container>
)

export const CustomAmount: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Rating count={2} />
    </Grid>
    <Grid>
      <Rating value={3} count={6} />
    </Grid>
    <Grid>
      <Rating value={4} count={8} />
    </Grid>
  </Grid.Container>
)

export const Icon: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Rating value={4} count={6} type="success" icon={<Umbrella />} />
    </Grid>
    <Grid>
      <Rating count={7} type="error" icon={<Zap />} />
    </Grid>
  </Grid.Container>
)
