import { Story, Meta } from '@storybook/react'
import Checkbox from '.'
import Spacer from '../spacer'

export default {
  title: 'Data Entry/Checkbox',
  component: Checkbox
} as Meta

export const Default: Story = () => (
  <Checkbox checked={true}>Check option</Checkbox>
)

export const Scale: Story = () => (
  <>
    <Checkbox mr="15px" checked={true} scale={0.25}>
      scale-0.25
    </Checkbox>
    <Checkbox mr="15px" checked={true} scale={0.5}>
      scale-0.5
    </Checkbox>
    <Checkbox mr="15px" checked={true} scale={0.75}>
      scale-0.75
    </Checkbox>
  </>
)

export const Type: Story = () => (
  <>
    <Checkbox checked={true} type="default">
      Checkbox Default
    </Checkbox>
    <Spacer h={0.5} />
    <Checkbox checked={true} type="success">
      Checkbox Success
    </Checkbox>
    <Spacer h={0.5} />
    <Checkbox checked={true} type="warning">
      Checkbox Warning
    </Checkbox>
    <Spacer h={0.5} />
    <Checkbox checked={true} type="error">
      Checkbox Error
    </Checkbox>
  </>
)

export const Disabled: Story = () => (
  <>
    <Checkbox>Checkbox option</Checkbox>
    <Spacer h={0.5} />
    <Checkbox disabled checked={true}>
      Checkbox option disabled
    </Checkbox>
  </>
)

export const Group: Story = () => {
  const handler = (value: any) => {
    console.log(value)
  }
  return (
    <Checkbox.Group value={['check3']} onChange={handler}>
      <Checkbox value="check1">Checkbox option 1</Checkbox>
      <Checkbox value="check2">Checkbox option 2</Checkbox>
      <Checkbox value="check3">Checkbox option 3</Checkbox>
      <Checkbox value="check4">Checkbox option 4</Checkbox>
    </Checkbox.Group>
  )
}
