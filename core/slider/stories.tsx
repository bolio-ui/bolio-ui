import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Slider from '.'
import Grid from '../grid'

export default {
  title: 'Data Entry/Slider',
  component: Slider
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Slider initialValue={40} />
    </Grid>
  </Grid.Container>
)

export const Type: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Slider initialValue={40} />
    </Grid>
    <Grid xs={12} md={12}>
      <Slider type="primary" initialValue={20} />
    </Grid>
    <Grid xs={12} md={12}>
      <Slider type="secondary" initialValue={70} />
    </Grid>
    <Grid xs={12} md={12}>
      <Slider type="success" initialValue={60} />
    </Grid>
    <Grid xs={12} md={12}>
      <Slider type="warning" initialValue={10} />
    </Grid>
    <Grid xs={12} md={12}>
      <Slider type="error" initialValue={80} />
    </Grid>
    <Grid xs={12} md={12}>
      <Slider type="info" initialValue={90} />
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Slider initialValue={50} disabled />
    </Grid>
  </Grid.Container>
)

export const Markers: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Slider step={10} showMarkers width="75%" />
    </Grid>
  </Grid.Container>
)

export const Range: Story = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Slider
        step={5}
        max={50}
        min={10}
        initialValue={25}
        showMarkers
        width="75%"
      />
    </Grid>
    <Grid xs={12} md={12}>
      <Slider
        step={0.2}
        max={1}
        min={0.2}
        initialValue={0.4}
        showMarkers
        width="75%"
      />
    </Grid>
  </Grid.Container>
)

export const Event: Story = () => {
  const [value, setValue] = useState()
  const handler = (val) => {
    console.log(val)
    setValue(val)
  }
  return (
    <Grid.Container gap={2}>
      <Grid xs={12} md={12}>
        <Slider value={value} onChange={handler} width="50%" />
      </Grid>
    </Grid.Container>
  )
}
