import { Story, Meta } from '@storybook/react'
import Checkbox from '.'
import Grid from '../grid'

export default {
  title: 'Data Entry/Checkbox',
  component: Checkbox
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Checkbox checked={true}>Check option</Checkbox>
    </Grid>
  </Grid.Container>
)

export const Scale: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Checkbox mr="15px" checked={true} scale={0.25}>
        scale-0.25
      </Checkbox>
    </Grid>
    <Grid>
      <Checkbox mr="15px" checked={true} scale={0.5}>
        scale-0.5
      </Checkbox>
    </Grid>
    <Grid>
      <Checkbox mr="15px" checked={true} scale={0.75}>
        scale-0.75
      </Checkbox>
    </Grid>
  </Grid.Container>
)

export const Type: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Checkbox checked={true} type="default">
        Checkbox Default
      </Checkbox>
    </Grid>
    <Grid>
      <Checkbox checked={true} type="success">
        Checkbox Success
      </Checkbox>
    </Grid>
    <Grid>
      <Checkbox checked={true} type="warning">
        Checkbox Warning
      </Checkbox>
    </Grid>
    <Grid>
      <Checkbox checked={true} type="error">
        Checkbox Error
      </Checkbox>
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Checkbox>Checkbox option</Checkbox>
    </Grid>
    <Grid>
      <Checkbox disabled checked={true}>
        Checkbox option disabled
      </Checkbox>
    </Grid>
  </Grid.Container>
)

export const Group: Story = () => {
  const handler = (value) => {
    console.log(value)
  }
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Checkbox.Group value={['check3']} onChange={handler}>
          <Checkbox value="check1">Checkbox option 1</Checkbox>
          <Checkbox value="check2">Checkbox option 2</Checkbox>
          <Checkbox value="check3">Checkbox option 3</Checkbox>
          <Checkbox value="check4">Checkbox option 4</Checkbox>
        </Checkbox.Group>
      </Grid>
    </Grid.Container>
  )
}
