import JsonViewer from '.'

export default function Example() {
  return (
    <JsonViewer
      rootName="user"
      value={{
        name: 'Ada',
        admin: true,
        tags: ['math', 'code'],
        address: { city: 'London' }
      }}
    />
  )
}
