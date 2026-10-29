import Table from '.'

const data = [
  { name: 'Ada Lovelace', role: 'Engineer', plan: 'Pro' },
  { name: 'Grace Hopper', role: 'Admiral', plan: 'Team' }
]

export default function Example() {
  return (
    <Table data={data}>
      <Table.Column prop="name" label="Name" />
      <Table.Column prop="role" label="Role" />
      <Table.Column prop="plan" label="Plan" />
    </Table>
  )
}
