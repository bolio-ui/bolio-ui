import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import NumberInput from '.'
import Grid from '../Grid'
import Text from '../Text'

export default {
  title: 'Data Entry/NumberInput',
  component: NumberInput
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <NumberInput aria-label="Quantity" initialValue={1} min={0} max={10} />
    </Grid>
    <Grid>
      <NumberInput aria-label="Price" initialValue={9.9} step={0.1} min={0} />
    </Grid>
    <Grid>
      <NumberInput aria-label="Year" placeholder="Year" hideControls />
    </Grid>
  </Grid.Container>
)

export const LabelAndError: StoryFn = () => {
  const [guests, setGuests] = useState<number | null>(12)
  const tooMany = guests !== null && guests > 10
  return (
    <NumberInput
      value={guests}
      onChange={setGuests}
      min={1}
      error={tooMany}
      errorMessage="The room fits 10 people. Remove a guest to continue."
    >
      Guests
    </NumberInput>
  )
}

export const Controlled: StoryFn = () => {
  const [value, setValue] = useState<number | null>(3)
  return (
    <Grid.Container gap={2} alignItems="center">
      <Grid>
        <NumberInput aria-label="Amount" value={value} onChange={setValue} />
      </Grid>
      <Grid>
        <Text my={0}>Value: {value === null ? 'empty' : value}</Text>
      </Grid>
    </Grid.Container>
  )
}
