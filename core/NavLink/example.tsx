import NavLink from '.'

export default function Example() {
  return (
    <div style={{ width: 240 }}>
      <NavLink label="Dashboard" href="#" active />
      <NavLink label="Settings" defaultOpened>
        <NavLink label="Profile" href="#" />
        <NavLink label="Billing" href="#" />
      </NavLink>
    </div>
  )
}
