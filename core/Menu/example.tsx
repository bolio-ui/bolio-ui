import Button from '../Button'
import Menu from '.'

export default function Example() {
  return (
    <Menu trigger={<Button>Options</Button>}>
      <Menu.Item shortcut="⌘E">Edit</Menu.Item>
      <Menu.Item shortcut="⌘D">Duplicate</Menu.Item>
      <Menu.Divider />
      <Menu.Item type="error">Delete</Menu.Item>
    </Menu>
  )
}
