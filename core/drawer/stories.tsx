import { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'
import { DrawerPlacement } from './helper'
import Drawer from '.'
import Button from '../button'
import Grid from '../grid'

export default {
  title: 'Feedback/Drawer',
  component: Drawer
} as Meta

export const Default: Story = () => {
  const [state, setState] = useState(false)
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Button auto onClick={() => setState(true)}>
          Show Drawer
        </Button>
        <Drawer
          visible={state}
          onClose={() => setState(false)}
          placement="right"
        >
          <Drawer.Title>Drawer</Drawer.Title>
          <Drawer.Subtitle>Example of a drawer</Drawer.Subtitle>
          <Drawer.Content>
            <p>Demo content for the drawer.</p>
          </Drawer.Content>
        </Drawer>
      </Grid>
    </Grid.Container>
  )
}

export const Placement: Story = () => {
  const [state, setState] = React.useState(false)
  const [placement, setPlacement] = React.useState<DrawerPlacement>('bottom')
  const open = (text) => {
    setPlacement(text)
    setState(true)
  }
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Button auto onClick={() => open('top')} mr="10px">
          Top
        </Button>
      </Grid>
      <Grid>
        <Button auto onClick={() => open('right')} mr="10px">
          Right
        </Button>
      </Grid>
      <Grid>
        <Button auto onClick={() => open('bottom')} mr="10px">
          Bottom
        </Button>
      </Grid>
      <Grid>
        <Button auto onClick={() => open('left')}>
          Left
        </Button>
      </Grid>
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
    </Grid.Container>
  )
}
