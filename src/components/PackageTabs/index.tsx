import React, { useState } from 'react'
import { SegmentedControl, Snippet, Spacer } from 'core'

const MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const

type Props = Record<(typeof MANAGERS)[number], string> & {
  width?: string
  action?: React.ReactNode
}

function PackageTabs({ width, action, ...commands }: Props) {
  const [manager, setManager] = useState<string | number>('pnpm')

  return (
    <>
      <SegmentedControl
        value={manager}
        onChange={setManager}
        aria-label="Package manager"
      >
        {MANAGERS.map((name) => (
          <SegmentedControl.Item key={name} value={name}>
            {name}
          </SegmentedControl.Item>
        ))}
      </SegmentedControl>
      <Spacer h={1} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {action}
        <Snippet
          text={commands[manager as keyof typeof commands]}
          width={action ? '100%' : width}
        />
      </div>
    </>
  )
}

export default PackageTabs
