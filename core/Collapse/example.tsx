import Collapse from '.'

export default function Example() {
  return (
    <Collapse.Group>
      <Collapse title="What is included?">All components and hooks.</Collapse>
      <Collapse title="Can I use it with Next.js?">
        Yes, with the App Router too.
      </Collapse>
    </Collapse.Group>
  )
}
