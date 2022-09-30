import { Story, Meta } from '@storybook/react'
import Pagination from '.'
import Grid from '../grid'
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  ArrowRightCircle,
  ArrowLeftCircle
} from '@bolio-ui/icons'

export default {
  title: 'Navigation/Pagination',
  component: Pagination
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Pagination count={20} initialPage={3} />
    </Grid>
  </Grid.Container>
)

export const Limit: Story = () => (
  <Grid.Container gap={2} direction="column">
    <Grid>
      <Pagination count={10} limit={10} />
    </Grid>
    <Grid>
      <Pagination count={5} />
    </Grid>
    <Grid>
      <Pagination count={10} initialPage={6} limit={5} />
    </Grid>
    <Grid>
      <Pagination count={10} initialPage={6} />
    </Grid>
    <Grid>
      <Pagination count={30} initialPage={6} limit={10} />
    </Grid>
  </Grid.Container>
)

export const Icon: Story = () => (
  <Grid.Container gap={2} direction="column">
    <Grid>
      <Pagination count={5}>
        <Pagination.Next>
          <ChevronRight />
        </Pagination.Next>
        <Pagination.Previous>
          <ChevronLeft />
        </Pagination.Previous>
      </Pagination>
    </Grid>
    <Grid>
      <Pagination count={5}>
        <Pagination.Next>
          <ArrowRight />
        </Pagination.Next>
        <Pagination.Previous>
          <ArrowLeft />
        </Pagination.Previous>
      </Pagination>
    </Grid>
    <Grid>
      <Pagination count={5}>
        <Pagination.Next>
          <ArrowRightCircle />
        </Pagination.Next>
        <Pagination.Previous>
          <ArrowLeftCircle />
        </Pagination.Previous>
      </Pagination>
    </Grid>
  </Grid.Container>
)
