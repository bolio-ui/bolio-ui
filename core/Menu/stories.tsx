import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Menu from '.'
import Button from '../Button'
import Grid from '../Grid'

export default {
  title: 'Navigation/Menu',
  component: Menu
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Menu trigger={<Button auto>Options</Button>}>
        <Menu.Item shortcut="⌘E">Edit</Menu.Item>
        <Menu.Item shortcut="⌘D">Duplicate</Menu.Item>
        <Menu.Item disabled>Archive</Menu.Item>
        <Menu.Divider />
        <Menu.Item type="error">Delete</Menu.Item>
      </Menu>
    </Grid>
  </Grid.Container>
)

export const LabelsAndSubmenus: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Menu trigger={<Button auto>File</Button>}>
        <Menu.Label>Document</Menu.Label>
        <Menu.Item>New</Menu.Item>
        <Menu.Item>Open</Menu.Item>
        <Menu.Sub label="Share">
          <Menu.Item>Email</Menu.Item>
          <Menu.Item>Copy link</Menu.Item>
          <Menu.Sub label="More">
            <Menu.Item>Embed</Menu.Item>
            <Menu.Item>Export</Menu.Item>
          </Menu.Sub>
        </Menu.Sub>
        <Menu.Divider />
        <Menu.Item>Close</Menu.Item>
      </Menu>
    </Grid>
  </Grid.Container>
)

export const CheckboxAndRadio: StoryFn = () => {
  const [grid, setGrid] = useState(true)
  const [ruler, setRuler] = useState(false)
  const [sort, setSort] = useState('name')
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Menu trigger={<Button auto>View</Button>}>
          <Menu.CheckboxItem checked={grid} onChange={setGrid}>
            Show grid
          </Menu.CheckboxItem>
          <Menu.CheckboxItem checked={ruler} onChange={setRuler}>
            Show ruler
          </Menu.CheckboxItem>
          <Menu.Divider />
          <Menu.Label>Sort by</Menu.Label>
          <Menu.RadioGroup aria-label="Sort by" value={sort} onChange={setSort}>
            <Menu.RadioItem value="name">Name</Menu.RadioItem>
            <Menu.RadioItem value="date">Date</Menu.RadioItem>
            <Menu.RadioItem value="size">Size</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu>
      </Grid>
    </Grid.Container>
  )
}
