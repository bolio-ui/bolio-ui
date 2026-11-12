import type { StoryFn, Meta } from '@storybook/react-vite'
import NProgress, { useNProgress } from '.'
import Button from '../Button'

export default {
  title: 'Feedback/NProgress',
  component: NProgress
} as Meta

export const Default: StoryFn = () => {
  const progress = useNProgress()
  return (
    <>
      <NProgress value={progress.value} visible={progress.visible} />
      <Button auto onClick={progress.start}>
        Start
      </Button>{' '}
      <Button auto onClick={progress.complete}>
        Complete
      </Button>
    </>
  )
}
