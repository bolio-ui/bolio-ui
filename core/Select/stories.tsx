import { Story, Meta } from '@storybook/react'
import Select from '.'
import Grid from '../Grid'
import Code from '../Code'

export default {
  title: 'Data Entry/Select',
  component: Select
} as Meta

export const Default: Story = () => {
  const handler = (val) => console.log(val)
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Select placeholder="Select one" onChange={handler}>
          <Select.Option value="1">Value 1</Select.Option>
          <Select.Option value="2">Value 2</Select.Option>
        </Select>
      </Grid>
    </Grid.Container>
  )
}

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Select placeholder="Default">
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
    <Grid>
      <Select type="primary" initialValue="1">
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
    <Grid>
      <Select type="secondary" initialValue="2">
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
    <Grid>
      <Select type="success" initialValue="1">
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
    <Grid>
      <Select type="warning" initialValue="2">
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
    <Grid>
      <Select type="error" initialValue="1">
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
    <Grid>
      <Select type="info" initialValue="2">
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
  </Grid.Container>
)

export const Disable: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Select placeholder="Select one" disabled>
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
  </Grid.Container>
)

export const DisabledOption: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Select placeholder="Select one">
        <Select.Option value="1" disabled>
          Value 1
        </Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
  </Grid.Container>
)

export const WithoutIcon: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Select placeholder="Select one" pure>
        <Select.Option value="1">Value 1</Select.Option>
        <Select.Option value="2">Value 2</Select.Option>
      </Select>
    </Grid>
  </Grid.Container>
)

export const Labels: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Select placeholder="Technologies">
        <Select.Option label>JavaScript</Select.Option>
        <Select.Option value="react">React</Select.Option>
        <Select.Option value="angular">Angular</Select.Option>
        <Select.Option label>Ruby</Select.Option>
        <Select.Option value="rails">Rails</Select.Option>
        <Select.Option value="php">PHP</Select.Option>
      </Select>
    </Grid>
  </Grid.Container>
)

export const Divider: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Select placeholder="Technologies">
        <Select.Option value="react">React</Select.Option>
        <Select.Option value="angular">Angular</Select.Option>
        <Select.Option divider />
        <Select.Option value="rails">Rails</Select.Option>
        <Select.Option value="php">PHP</Select.Option>
      </Select>
    </Grid>
  </Grid.Container>
)

export const Multiple: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
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
    </Grid>
  </Grid.Container>
)

export const MultipleWithoutClear: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
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
    </Grid>
  </Grid.Container>
)

export const Component: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Select placeholder="Value one" initialValue="1">
        <Select.Option value="1">
          <Code>TypeScript</Code>
        </Select.Option>
        <Select.Option value="2">
          <Code>JavaScript</Code>
        </Select.Option>
      </Select>
    </Grid>
  </Grid.Container>
)

export const OverWidth: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Select placeholder="Choose one" value="1" width="150px">
        <Select.Option value="1">Truncate an overly long string</Select.Option>
        <Select.Option value="2">Option 2</Select.Option>
      </Select>
    </Grid>
    <Grid>
      <Select
        placeholder="Choose one"
        value="1"
        width="150px"
        disableMatchWidth
      >
        <Select.Option value="1">
          Autoscale option width when text is too long
        </Select.Option>
        <Select.Option value="2">Option 2</Select.Option>
      </Select>
    </Grid>
  </Grid.Container>
)
