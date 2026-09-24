import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Combobox from '.'
import Grid from '../Grid'
import Text from '../Text'

export default {
  title: 'Data Entry/Combobox',
  component: Combobox
} as Meta

const countries = [
  { value: 'br', label: 'Brazil' },
  { value: 'pt', label: 'Portugal' },
  { value: 'us', label: 'United States' },
  { value: 'ar', label: 'Argentina' },
  { value: 'xx', label: 'Nowhere', disabled: true }
]

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Combobox
        aria-label="Country"
        placeholder="Search a country"
        options={countries}
      />
    </Grid>
  </Grid.Container>
)

export const Controlled: StoryFn = () => {
  const [value, setValue] = useState<string | null>('pt')
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Combobox
          aria-label="Country"
          options={countries}
          value={value}
          onChange={setValue}
        />
        <Text small>Selected: {value ?? 'none'}</Text>
      </Grid>
    </Grid.Container>
  )
}

export const Disabled: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Combobox aria-label="Country" options={countries} disabled />
    </Grid>
  </Grid.Container>
)
