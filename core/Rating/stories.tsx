import type { StoryFn, Meta } from '@storybook/react-vite'
import React, { useState } from 'react'
import Rating from '.'
import Grid from '../Grid'
import { Umbrella, Zap } from '@bolio-ui/icons'

export default {
  title: 'Feedback/Rating',
  component: Rating
} as Meta

export const Default: StoryFn = () => {
  const [value, setValue] = useState(3)
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Rating value={value} onChange={setValue} />
      </Grid>
      <Grid>Selection: {value}</Grid>
    </Grid.Container>
  )
}

export const Types: StoryFn = () => (
  <Grid.Container gap={2}>
    {(
      [
        'default',
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info'
      ] as const
    ).map((type) => (
      <Grid key={type}>
        <Rating type={type} initialValue={3} />
      </Grid>
    ))}
  </Grid.Container>
)

export const Variants: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Rating variant="outline" initialValue={3} />
    </Grid>
    <Grid>
      <Rating variant="filled" initialValue={3} />
    </Grid>
  </Grid.Container>
)

export const HalfPrecision: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Rating precision={0.5} initialValue={2.5} />
    </Grid>
    <Grid>
      <Rating precision={0.5} readOnly value={3.5} />
    </Grid>
  </Grid.Container>
)

export const States: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Rating readOnly value={4} />
    </Grid>
    <Grid>
      <Rating disabled value={4} />
    </Grid>
    <Grid>
      <Rating clearable initialValue={2} />
    </Grid>
  </Grid.Container>
)

export const CustomAmount: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Rating count={3} initialValue={2} />
    </Grid>
    <Grid>
      <Rating count={10} initialValue={7} />
    </Grid>
  </Grid.Container>
)

export const Icon: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Rating initialValue={4} type="success" icon={<Umbrella />} />
    </Grid>
    <Grid>
      <Rating initialValue={5} type="error" icon={<Zap />} />
    </Grid>
  </Grid.Container>
)

export const HighlightSelectedOnly: StoryFn = () => (
  <Rating highlightSelectedOnly initialValue={3} icon={<Zap />} />
)
