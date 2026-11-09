import Schedule from '.'

const start = new Date()
start.setHours(9, 0, 0, 0)
const end = new Date(start)
end.setHours(10, 30)

export default function Example() {
  return (
    <Schedule
      height={360}
      events={[{ id: 1, title: 'Planning', start, end }]}
    />
  )
}
