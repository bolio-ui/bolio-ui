import React from 'react'
import { Popover, Link } from 'core'

const UserSettings: React.FC = () => (
  <>
    <Popover.Item title>
      <span>User Settings</span>
    </Popover.Item>
    <Popover.Item>
      <Link href="#">Teams</Link>
    </Popover.Item>
    <Popover.Item>
      <Link href="#">GitHub</Link>
    </Popover.Item>
    <Popover.Item line />
    <Popover.Item>
      <Link href="#">Logout</Link>
    </Popover.Item>
  </>
)

export default UserSettings
