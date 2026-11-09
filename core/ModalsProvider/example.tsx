import ModalsProvider, { useModals } from '.'
import Button from '../Button'

function Demo() {
  const modals = useModals()
  return (
    <Button
      onClick={() =>
        modals.openConfirm({
          title: 'Delete project?',
          children: 'This cannot be undone.',
          labels: { confirm: 'Delete', cancel: 'Keep' }
        })
      }
    >
      Delete project
    </Button>
  )
}

export default function Example() {
  return (
    <ModalsProvider>
      <Demo />
    </ModalsProvider>
  )
}
