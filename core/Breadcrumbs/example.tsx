import Breadcrumbs from '.'

export default function Example() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/settings">Settings</Breadcrumbs.Item>
      <Breadcrumbs.Item>General</Breadcrumbs.Item>
    </Breadcrumbs>
  )
}
