import { Story, Meta } from '@storybook/react'
import Grid from '.'
import Card from '../Card'

export default {
  title: 'Layout/Grid',
  component: Grid
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2} justify="center" height="100px">
    <Grid xs={6}>
      <Card shadow width="100%" />
    </Grid>
    <Grid xs={6}>
      <Card shadow width="100%" />
    </Grid>
    <Grid xs={6}>
      <Card shadow width="100%" />
    </Grid>
  </Grid.Container>
)

export const FluidLayout: Story = () => (
  <Grid.Container gap={2} justify="center">
    <Grid xs={12}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={6}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={6}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={6}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
  </Grid.Container>
)

export const ResponsiveLayout: Story = () => (
  <Grid.Container gap={2} justify="center">
    <Grid xs={12} md={6}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={6} md={6}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={6} md={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={6} md={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={6} md={3}>
      <Card shadow width="100%" height="50px" />
    </Grid>
  </Grid.Container>
)

export const HideElement: Story = () => (
  <Grid.Container gap={2} justify="center">
    <Grid xs={6} sm={0}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={6} sm={0}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={12}>
      <Card shadow width="100%" height="50px" />
    </Grid>
    <Grid xs={12}>
      <Card shadow width="100%" height="50px" />
    </Grid>
  </Grid.Container>
)

export const AutoWidth: Story = () => (
  <>
    <Grid.Container gap={2} justify="center">
      <Grid xs>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs>
        <Card shadow width="100%" height="50px" />
      </Grid>
    </Grid.Container>
    <Grid.Container gap={2} justify="center">
      <Grid xs>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs={12}>
        <Card shadow width="100%" height="50px" />
      </Grid>
      <Grid xs>
        <Card shadow width="100%" height="50px" />
      </Grid>
    </Grid.Container>
  </>
)
