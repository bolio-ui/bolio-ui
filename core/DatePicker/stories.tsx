import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
import DatePicker from '.'
import Grid from '../Grid'
import Text from '../Text'

export default {
  title: 'Data Entry/DatePicker',
  component: DatePicker
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <DatePicker aria-label="Birthday" />
    </Grid>
  </Grid.Container>
)

export const Controlled: Story = () => {
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

export const MinAndMax: Story = () => (
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

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <DatePicker aria-label="Birthday" disabled />
    </Grid>
  </Grid.Container>
)
