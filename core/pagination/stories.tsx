import { Story, Meta } from '@storybook/react'
import Pagination from '.'
import Spacer from '../spacer'
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

export const Default: Story = () => <Pagination count={20} initialPage={3} />

export const Limit: Story = () => (
  <>
    <Pagination count={10} limit={10} />
    <Pagination count={5} />
    <Pagination count={10} initialPage={6} limit={5} />
    <Pagination count={10} initialPage={6} />
    <Pagination count={30} initialPage={6} limit={10} />
  </>
)

export const Icon: Story = () => (
  <>
    <Pagination count={5}>
      <Pagination.Next>
        <ChevronRight />
      </Pagination.Next>
      <Pagination.Previous>
        <ChevronLeft />
      </Pagination.Previous>
    </Pagination>
    <Spacer h={0.5} />
    <Pagination count={5}>
      <Pagination.Next>
        <ArrowRight />
      </Pagination.Next>
      <Pagination.Previous>
        <ArrowLeft />
      </Pagination.Previous>
    </Pagination>
    <Spacer h={0.5} />
    <Pagination count={5}>
      <Pagination.Next>
        <ArrowRightCircle />
      </Pagination.Next>
      <Pagination.Previous>
        <ArrowLeftCircle />
      </Pagination.Previous>
    </Pagination>
  </>
)
