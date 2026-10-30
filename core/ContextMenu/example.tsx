import Card from '../Card'
import Menu from '../Menu'
import ContextMenu from '.'

export default function Example() {
  return (
    <ContextMenu
      tabIndex={0}
      content={
        <>
          <Menu.Item shortcut="⌘C">Copy</Menu.Item>
          <Menu.Item shortcut="⌘V">Paste</Menu.Item>
          <Menu.Divider />
          <Menu.Item type="error">Delete</Menu.Item>
        </>
      }
    >
      <Card bordered>Right click anywhere in this card</Card>
    </ContextMenu>
  )
}
