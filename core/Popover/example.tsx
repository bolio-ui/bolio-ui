import Link from '../Link'
import Popover from '.'

export default function Example() {
  const content = () => (
    <div style={{ padding: '0 10px' }}>
      <Link href="#">Profile</Link>
      <br />
      <Link href="#">Sign out</Link>
    </div>
  )

  return <Popover content={content}>Account</Popover>
}
