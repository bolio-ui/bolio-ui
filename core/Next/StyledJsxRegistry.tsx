import React, { useState } from 'react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore next/navigation only exists in Next.js 13 and later
import { useServerInsertedHTML } from 'next/navigation'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'

// Collects the styles rendered on the server and inserts them in the HTML,
// which the App Router does not do for styled-jsx on its own.
const StyledJsxRegistry: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const [registry] = useState(() => createStyleRegistry())

  useServerInsertedHTML(() => {
    const styles = registry.styles()
    registry.flush()
    return <>{styles}</>
  })

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>
}

export default StyledJsxRegistry
