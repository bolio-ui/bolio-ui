import Button from '../Button'
import EmptyState from '.'

export default function Example() {
  return (
    <EmptyState
      title="No messages yet"
      description="Messages from your team show up here. Invite someone to start a conversation."
      action={<Button type="primary">Invite a teammate</Button>}
    />
  )
}
