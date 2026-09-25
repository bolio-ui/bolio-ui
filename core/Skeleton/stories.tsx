import React, { useEffect, useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Skeleton from '.'
import Grid from '../Grid'
import Text from '../Text'

export default {
  title: 'Feedback/Skeleton',
  component: Skeleton
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2} direction="column">
    <Grid>
      <Skeleton width="60%" />
    </Grid>
    <Grid>
      <Skeleton lines={3} />
    </Grid>
    <Grid>
      <Skeleton height="120px" />
    </Grid>
  </Grid.Container>
)

export const Card: StoryFn = () => (
  <Grid.Container gap={2} alignItems="center" style={{ maxWidth: 400 }}>
    <Grid>
      <Skeleton circle width="48px" />
    </Grid>
    <Grid xs>
      <Skeleton lines={2} />
    </Grid>
  </Grid.Container>
)

export const WithContent: StoryFn = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <Skeleton lines={2} loading={loading}>
      <Text>The content shows up here once it has loaded.</Text>
    </Skeleton>
  )
}
