import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import DatePicker from '.'
import Grid from '../Grid'
import Text from '../Text'

export default {
  title: 'Data Entry/DatePicker',
  component: DatePicker
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <DatePicker aria-label="Birthday" />
    </Grid>
  </Grid.Container>
)

export const Controlled: StoryFn = () => {
  const [date, setDate] = useState<Date | null>(new Date(2026, 0, 15))
  return (
    <Grid.Container gap={2}>
      <Grid>
        <DatePicker aria-label="Birthday" value={date} onChange={setDate} />
        <Text small>Selected: {date ? date.toDateString() : 'none'}</Text>
      </Grid>
    </Grid.Container>
  )
}

export const MinAndMax: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <DatePicker
        aria-label="Trip date"
        min={new Date(2026, 0, 10)}
        max={new Date(2026, 0, 20)}
        initialValue={new Date(2026, 0, 15)}
      />
    </Grid>
  </Grid.Container>
)

export const Disabled: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <DatePicker aria-label="Birthday" disabled />
    </Grid>
  </Grid.Container>
)
