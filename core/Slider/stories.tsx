import type { StoryFn, Meta } from '@storybook/react-vite'
import React, { useState } from 'react'
import Slider from '.'
import Grid from '../Grid'

export default {
  title: 'Data Entry/Slider',
  component: Slider
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Slider initialValue={40} />
    </Grid>
  </Grid.Container>
)

export const Type: StoryFn = () => (
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

export const Disabled: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Slider initialValue={50} disabled />
    </Grid>
  </Grid.Container>
)

export const Markers: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid xs={12} md={12}>
      <Slider step={10} showMarkers width="75%" />
    </Grid>
  </Grid.Container>
)

export const Range: StoryFn = () => (
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

export const Event: StoryFn = () => {
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
