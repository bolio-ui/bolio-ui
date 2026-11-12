import type { StoryFn, Meta } from '@storybook/react-vite'
import NavLink from '.'

export default {
  title: 'Navigation/NavLink',
  component: NavLink
} as Meta

export const Default: StoryFn = () => (
  <div style={{ width: 240 }}>
    <NavLink label="Dashboard" href="#" active />
    <NavLink label="Reports" description="Monthly and yearly" href="#" />
    <NavLink label="Settings" defaultOpened>
      <NavLink label="Profile" href="#" />
      <NavLink label="Billing" href="#" />
    </NavLink>
    <NavLink label="Archived" disabled />
  </div>
)
