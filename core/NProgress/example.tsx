import NProgress, { useNProgress } from '.'
import Button from '../Button'

export default function Example() {
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
