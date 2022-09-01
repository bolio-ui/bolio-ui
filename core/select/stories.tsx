import { Story, Meta } from '@storybook/react'
import Select from '.'
import Spacer from '../spacer'
import Code from '../code'

export default {
  title: 'Data Entry/Select',
  component: Select
} as Meta

export const Default: Story = () => {
  const handler = (val: any) => console.log(val)
  return (
    <Select placeholder="Select one" onChange={handler}>
      <Select.Option value="1">Value 1</Select.Option>
      <Select.Option value="2">Value 2</Select.Option>
    </Select>
  )
}

export const Types: Story = () => (
  <>
    <Select placeholder="Default" type="default">
      <Select.Option value="1">Value 1</Select.Option>
      <Select.Option value="2">Value 2</Select.Option>
    </Select>
    <Spacer h={0.5} />
    <Select type="success" initialValue="1">
      <Select.Option value="1">Value 1</Select.Option>
      <Select.Option value="2">Value 2</Select.Option>
    </Select>
    <Spacer h={0.5} />
    <Select type="warning" initialValue="2">
      <Select.Option value="1">Value 1</Select.Option>
      <Select.Option value="2">Value 2</Select.Option>
    </Select>
    <Spacer h={0.5} />
    <Select type="error" initialValue="1">
      <Select.Option value="1">Value 1</Select.Option>
      <Select.Option value="2">Value 2</Select.Option>
    </Select>
  </>
)

export const Disable: Story = () => (
  <Select placeholder="Select one" disabled>
    <Select.Option value="1">Value 1</Select.Option>
    <Select.Option value="2">Value 2</Select.Option>
  </Select>
)

export const DisabledOption: Story = () => (
  <Select placeholder="Select one">
    <Select.Option value="1" disabled>
      Value 1
    </Select.Option>
    <Select.Option value="2">Value 2</Select.Option>
  </Select>
)

export const WithoutIcon: Story = () => (
  <Select placeholder="Select one" pure>
    <Select.Option value="1">Value 1</Select.Option>
    <Select.Option value="2">Value 2</Select.Option>
  </Select>
)

export const Labels: Story = () => (
  <Select placeholder="Technologies">
    <Select.Option label>JavaScript</Select.Option>
    <Select.Option value="react">React</Select.Option>
    <Select.Option value="angular">Angular</Select.Option>
    <Select.Option label>Ruby</Select.Option>
    <Select.Option value="rails">Rails</Select.Option>
    <Select.Option value="php">PHP</Select.Option>
  </Select>
)

export const Divider: Story = () => (
  <Select placeholder="Technologies">
    <Select.Option value="react">React</Select.Option>
    <Select.Option value="angular">Angular</Select.Option>
    <Select.Option divider />
    <Select.Option value="rails">Rails</Select.Option>
    <Select.Option value="php">PHP</Select.Option>
  </Select>
)

export const Multiple: Story = () => (
  <Select
    placeholder="Technologies"
    multiple
    width="200px"
    initialValue={['1', '3', '4', '6']}
  >
    <Select.Option value="1">React</Select.Option>
    <Select.Option value="2">Angular</Select.Option>
    <Select.Option value="3">Vue</Select.Option>
    <Select.Option divider />
    <Select.Option value="4">Rails</Select.Option>
    <Select.Option value="5">PHP</Select.Option>
    <Select.Option divider />
    <Select.Option value="6">Express</Select.Option>
    <Select.Option value="7">Koa</Select.Option>
  </Select>
)

export const MultipleWithoutClear: Story = () => (
  <Select
    placeholder="Technologies"
    multiple
    width="200px"
    clearable={false}
    initialValue={['1', '3', '4', '6']}
  >
    <Select.Option value="1">React</Select.Option>
    <Select.Option value="2">Angular</Select.Option>
    <Select.Option value="3">Vue</Select.Option>
    <Select.Option divider />
    <Select.Option value="4">Rails</Select.Option>
    <Select.Option value="5">PHP</Select.Option>
    <Select.Option divider />
    <Select.Option value="6">Express</Select.Option>
    <Select.Option value="7">Koa</Select.Option>
  </Select>
)

export const Component: Story = () => (
  <Select placeholder="Value one" initialValue="1">
    <Select.Option value="1">
      <Code>TypeScript</Code>
    </Select.Option>
    <Select.Option value="2">
      <Code>JavaScript</Code>
    </Select.Option>
  </Select>
)

export const OverWidth: Story = () => (
  <>
    <Select placeholder="Choose one" value="1" width="150px">
      <Select.Option value="1">Truncate an overly long string</Select.Option>
      <Select.Option value="2">Option 2</Select.Option>
    </Select>
    <Spacer h={0.5} />
    <Select placeholder="Choose one" value="1" width="150px" disableMatchWidth>
      <Select.Option value="1">
        Autoscale option width when text is too long
      </Select.Option>
      <Select.Option value="2">Option 2</Select.Option>
    </Select>
  </>
)
