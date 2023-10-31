import { Story, Meta } from '@storybook/react'
import ButtonGroup from '.'
import Button from '../Button'
import Grid from '../Grid'

export default {
  title: 'Data Entry/ButtonGroup',
  component: ButtonGroup
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Grid>
  </Grid.Container>
)

export const Variant: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonGroup type="success">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Grid>
    <Grid>
      <ButtonGroup type="abort">
        <Button>Action1</Button>
        <Button>Action2</Button>
      </ButtonGroup>
    </Grid>
    <Grid>
      <ButtonGroup type="warning" ghost>
        <Button>Action1</Button>
        <Button>Action2</Button>
      </ButtonGroup>
    </Grid>
    <Grid>
      <ButtonGroup type="success-light">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Grid>
  </Grid.Container>
)

export const Sizes: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonGroup scale={2 / 3}>
        <Button scale={2 / 3}>One</Button>
        <Button scale={2 / 3}>Two</Button>
        <Button scale={2 / 3}>Three</Button>
      </ButtonGroup>
    </Grid>
    <Grid>
      <ButtonGroup scale={1 / 3}>
        <Button scale={1 / 3}>Action1</Button>
        <Button scale={1 / 3}>Action2</Button>
      </ButtonGroup>
    </Grid>
  </Grid.Container>
)

export const Vertical: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonGroup vertical>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
        <Button>Four</Button>
      </ButtonGroup>
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonGroup scale={0.5} disabled>
        <Button scale={0.5}>One</Button>
        <Button scale={0.5}>Two</Button>
        <Button scale={0.5}>Three</Button>
      </ButtonGroup>
    </Grid>
  </Grid.Container>
)
