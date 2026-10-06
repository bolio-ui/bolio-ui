import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import ContextMenu from '.'
import Menu from '../Menu'
import Card from '../Card'

export default {
  title: 'Overlay/ContextMenu',
  component: ContextMenu
} as Meta

export const Default: StoryFn = () => (
  <ContextMenu
    content={
      <>
        <Menu.Item shortcut="⌘C">Copy</Menu.Item>
        <Menu.Item shortcut="⌘V">Paste</Menu.Item>
        <Menu.Divider />
        <Menu.Item type="error">Delete</Menu.Item>
      </>
    }
  >
    <Card bordered style={{ minHeight: 160 }}>
      Right click anywhere in this card
    </Card>
  </ContextMenu>
)

export const Disabled: StoryFn = () => (
  <ContextMenu disabled content={<Menu.Item>Never shown</Menu.Item>}>
    <Card bordered>The browser menu opens here</Card>
  </ContextMenu>
)
