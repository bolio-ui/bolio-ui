import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import Table from '.'
import Code from '../Code'
import Text from '../Text'
import Button from '../Button'

export default {
  title: 'Data Display/Table',
  component: Table
} as Meta

export const Default: Story = () => {
  const data = [
    {
      property: 'type',
      description: 'Content type',
      type: 'secondary | warning',
      default: '-'
    },
    {
      property: 'Component',
      description: 'DOM element to use',
      type: 'string',
      default: '-'
    },
    {
      property: 'bold',
      description: 'Bold style',
      type: 'boolean',
      default: 'true'
    }
  ]
  return (
    <Table data={data}>
      <Table.Column prop="property" label="property" />
      <Table.Column prop="description" label="description" />
      <Table.Column prop="type" label="type" />
      <Table.Column prop="default" label="default" />
    </Table>
  )
}

export const Compose: Story = () => {
  const data = [
    {
      property: 'type',
      description: 'Content type',
      type: 'secondary | warning',
      default: '-'
    },
    {
      property: 'Component',
      description: 'DOM element to use',
      type: <Code>string</Code>,
      default: '-'
    },
    {
      property: <Text b>bold</Text>,
      description: 'Bold style',
      type: <Code>boolean</Code>,
      default: <Code>true</Code>
    }
  ]
  return (
    <Table data={data}>
      <Table.Column prop="property" label="property" />
      <Table.Column prop="description" label="description" />
      <Table.Column prop="type" label="type" />
      <Table.Column prop="default" label="default" />
    </Table>
  )
}

export const Width: Story = () => {
  const data = [
    {
      property: 'type',
      description: 'Content type',
      type: 'secondary | warning',
      default: '-'
    },
    {
      property: 'Component',
      description: 'DOM element to use',
      type: <Code>string</Code>,
      default: '-'
    },
    {
      property: <Text b>bold</Text>,
      description: 'Bold style',
      type: <Code>boolean</Code>,
      default: <Code>true</Code>
    }
  ]
  return (
    <Table data={data}>
      <Table.Column prop="property" label="property" width={50} />
      <Table.Column prop="description" label="description" />
      <Table.Column prop="type" label="type" />
      <Table.Column prop="default" label="default" />
    </Table>
  )
}

export const Actions: Story = () => {
  const dataSource = [
    { property: 'type', description: 'Content type', operation: '' },
    { property: 'Component', description: 'DOM element to use', operation: '' },
    { property: <Text b>bold</Text>, description: 'Bold style', operation: '' }
  ]
  const [data, setData] = useState(dataSource)
  const renderAction = (value, rowData, index) => {
    const removeHandler = () => {
      setData((last) => last.filter((_, dataIndex) => dataIndex !== index))
    }
    return (
      <Button
        type="error"
        auto
        scale={1 / 3}
        font="12px"
        onClick={removeHandler}
      >
        Remove
      </Button>
    )
  }
  return (
    <Table data={data} onChange={(value) => setData(value)}>
      <Table.Column prop="property" label="property" />
      <Table.Column prop="description" label="description" />
      <Table.Column
        prop="operation"
        label="operation"
        width={150}
        render={renderAction}
      />
    </Table>
  )
}

export const UpdateRow: Story = () => {
  const dataSource = [
    { property: 'type', description: 'Content type', operation: '' },
    { property: 'Component', description: 'DOM element to use', operation: '' },
    { property: <Text b>bold</Text>, description: 'Bold style', operation: '' }
  ]
  const [data, setData] = React.useState(dataSource)
  const renderAction = (value, rowData, rowIndex) => {
    const updateHandler = () => {
      setData((last) => {
        return last.map((item, dataIndex) => {
          if (dataIndex !== rowIndex) return item
          return {
            ...item,
            property: Math.random().toString(16).slice(-5)
          }
        })
      })
    }
    return (
      <Button
        type="secondary"
        auto
        scale={1 / 3}
        font="12px"
        onClick={updateHandler}
      >
        Update
      </Button>
    )
  }
  return (
    <Table data={data} onChange={(value) => setData(value)}>
      <Table.Column prop="property" label="property" />
      <Table.Column prop="description" label="description" />
      <Table.Column
        prop="operation"
        label="operation"
        width={150}
        render={renderAction}
      />
    </Table>
  )
}

export const CustomHead: Story = () => {
  const data = [
    {
      property: 'type',
      description: 'Content type',
      type: 'secondary | warning',
      default: '-'
    },
    {
      property: 'Component',
      description: 'DOM element to use',
      type: <Code>string</Code>,
      default: '-'
    },
    {
      property: <Text b>bold</Text>,
      description: 'Bold style',
      type: <Code>boolean</Code>,
      default: <Code>true</Code>
    }
  ]
  return (
    <Table data={data}>
      <Table.Column prop="property" label="property" />
      <Table.Column prop="description" label="description" />
      <Table.Column prop="type">
        <Code>type</Code>
      </Table.Column>
      <Table.Column prop="default">
        <Text b>default</Text>
      </Table.Column>
    </Table>
  )
}
