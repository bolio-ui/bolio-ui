import Splitter from '.'

export default function Example() {
  return (
    <div style={{ height: 200 }}>
      <Splitter>
        <Splitter.Panel defaultSize={30}>Sidebar</Splitter.Panel>
        <Splitter.Panel>Content</Splitter.Panel>
      </Splitter>
    </div>
  )
}
