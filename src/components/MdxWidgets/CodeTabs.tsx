import React, { useMemo, useState } from 'react'
import { CodeBlock, extractFileName, FILE_NAME_PREFIX } from './HybridCode'

// Each code block inside gets its own tab, named by its `// NAME:` line.
const CodeTabs: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [active, setActive] = useState(0)

  const items = useMemo(
    () =>
      React.Children.toArray(children)
        .filter(React.isValidElement)
        .map((child, index) => {
          const { children: content, name } = extractFileName(
            (child.props as { children?: React.ReactNode }).children
          )
          return {
            content,
            label:
              name?.replace(FILE_NAME_PREFIX, '').trim() || `Tab ${index + 1}`
          }
        }),
    [children]
  )

  return (
    <CodeBlock
      tabs={items.map(({ label }) => label)}
      activeTab={active}
      onTabChange={setActive}
    >
      {items[active]?.content}
    </CodeBlock>
  )
}

export default CodeTabs
