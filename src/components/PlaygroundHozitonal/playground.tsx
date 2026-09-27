import React from 'react'
import dynamic from 'next/dynamic'
import { Loading } from 'core'

const DynamicLive = dynamic(() => import('./dynamic-live'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: 340,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Loading spaceRatio={5} />
    </div>
  )
})

export type PlaygroundHorizontalProps = {
  title?: React.ReactNode | string
  desc?: React.ReactNode | string
  code: string
  scope: {
    [key: string]: unknown
  }
}

function PlaygroundHorizontal({
  code: inputCode = '',
  scope
}: PlaygroundHorizontalProps) {
  const code = inputCode.trim()

  return <DynamicLive code={code} scope={scope} />
}

PlaygroundHorizontal.displayName = 'BolioUIPlaygroundHorizontal'
export default React.memo(PlaygroundHorizontal)
