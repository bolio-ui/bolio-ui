import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import { DrawerPlacement } from './helper'
import Drawer from '.'
import Button from '../button'

export default {
  title: 'Feedback/Drawer',
  component: Drawer
} as Meta

export const Default: Story = () => {
  const [state, setState] = useState(false)
  return (
    <div>
      <Button auto onClick={() => setState(true)} scale={1 / 2}>
        Show Drawer
      </Button>
      <Drawer visible={state} onClose={() => setState(false)} placement="right">
        <Drawer.Title>Drawer</Drawer.Title>
        <Drawer.Subtitle>Example of a drawer</Drawer.Subtitle>
        <Drawer.Content>
          <p>Demo content for the drawer.</p>
        </Drawer.Content>
      </Drawer>
    </div>
  )
}

export const Placement: Story = () => {
  const [state, setState] = React.useState(false)
  const [placement, setPlacement] = React.useState<DrawerPlacement>('bottom')
  const open = (text: any) => {
    setPlacement(text)
    setState(true)
  }
  return (
    <div>
      <Button auto onClick={() => open('top')} scale={1 / 2} mr="10px">
        Top
      </Button>
      <Button auto onClick={() => open('right')} scale={1 / 2} mr="10px">
        Right
      </Button>
      <Button auto onClick={() => open('bottom')} scale={1 / 2} mr="10px">
        Bottom
      </Button>
      <Button auto onClick={() => open('left')} scale={1 / 2}>
        Left
      </Button>
      <Drawer
        visible={state}
        onClose={() => setState(false)}
        placement={placement}
      >
        <Drawer.Title>Drawer</Drawer.Title>
        <Drawer.Subtitle>Example of a drawer</Drawer.Subtitle>
        <Drawer.Content>
          <p>Demo content for the drawer.</p>
        </Drawer.Content>
      </Drawer>
    </div>
  )
}
