import { Story, Meta } from '@storybook/react'
import NextLink from 'next/link'
import Breadcrumbs from '.'
import Grid from '../Grid'
import { Home, Settings } from '@bolio-ui/icons'

export default {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="">Settings</Breadcrumbs.Item>
        <Breadcrumbs.Item>General</Breadcrumbs.Item>
      </Breadcrumbs>
    </Grid>
  </Grid.Container>
)

export const Separator: Story = () => (
  <Grid.Container gap={2} direction="column">
    <Grid>
      <Breadcrumbs separator="-">
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="">Categories</Breadcrumbs.Item>
        <Breadcrumbs.Item>Add</Breadcrumbs.Item>
      </Breadcrumbs>
    </Grid>
    <Grid>
      <Breadcrumbs separator=">">
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Separator>:</Breadcrumbs.Separator>
        <Breadcrumbs.Item href="">Pages</Breadcrumbs.Item>
        <Breadcrumbs.Item href="">Default</Breadcrumbs.Item>
        <Breadcrumbs.Item>Index</Breadcrumbs.Item>
      </Breadcrumbs>
    </Grid>
  </Grid.Container>
)

export const Icons: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Breadcrumbs>
        <Breadcrumbs.Item>
          <Home />
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href="">
          <Settings /> Settings
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>General</Breadcrumbs.Item>
      </Breadcrumbs>
    </Grid>
  </Grid.Container>
)

export const WithNextjs: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Breadcrumbs>
        <NextLink href="/">
          <Breadcrumbs.Item nextLink>Home</Breadcrumbs.Item>
        </NextLink>
        <NextLink href="/settings">
          <Breadcrumbs.Item nextLink>Settings</Breadcrumbs.Item>
        </NextLink>
        <Breadcrumbs.Item>General</Breadcrumbs.Item>
      </Breadcrumbs>
    </Grid>
  </Grid.Container>
)
