import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import useTheme from '../use-theme'
import Progress from '.'
import Grid from '../Grid'
import Button from '../Button'

export default {
  title: 'Feedback/Progress',
  component: Progress
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Progress value={50} />
    </Grid>
  </Grid.Container>
)

export const CustomMax: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Progress value={45} max={50} />
    </Grid>
  </Grid.Container>
)

export const DynamicColors: Story = () => {
  const theme = useTheme()

  const [value, setValue] = useState(20)

  const colors = {
    20: theme.palette.error,
    40: theme.palette.warning,
    60: theme.palette.success,
    80: '#000'
  }

  return (
    <Grid.Container gap={2}>
      <Grid xs={12} md={12}>
        <Progress value={value} colors={colors} />
      </Grid>
      <Grid>
        <Button onClick={() => setValue(value + 20)} auto scale={0.5}>
          Add
        </Button>
      </Grid>
      <Grid>
        <Button onClick={() => setValue(20)} auto scale={0.5} type="error">
          Remove
        </Button>
      </Grid>
    </Grid.Container>
  )
}

export const Type: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Progress value={3} />
    </Grid>
    <Grid xs={12} md={12}>
      <Progress type="primary" value={74} />
    </Grid>
    <Grid xs={12} md={12}>
      <Progress type="secondary" value={10} />
    </Grid>
    <Grid xs={12} md={12}>
      <Progress type="success" value={45} />
    </Grid>
    <Grid xs={12} md={12}>
      <Progress type="warning" value={100} />
    </Grid>
    <Grid xs={12} md={12}>
      <Progress type="error" value={21} />
    </Grid>
    <Grid xs={12} md={12}>
      <Progress type="info" value={34} />
    </Grid>
  </Grid.Container>
)
