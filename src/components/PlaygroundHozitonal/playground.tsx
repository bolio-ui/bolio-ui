import React from 'react'
import dynamic from 'next/dynamic'
import { Loading } from 'core'

const DynamicLive = dynamic(() => import('./dynamic-live'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => (
    <div style={{ padding: '20pt 0' }}>
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

const defaultProps = {
  desc: '',
  code: '',
  bindings: {}
}

function PlaygroundHorizontal({
  code: inputCode,
  scope
}: PlaygroundHorizontalProps & typeof defaultProps) {
  const code = inputCode.trim()

  return <DynamicLive code={code} scope={scope} />
}

PlaygroundHorizontal.defaultProps = defaultProps
PlaygroundHorizontal.displayName = 'BolioUIPlaygroundHorizontal'
export default React.memo(PlaygroundHorizontal)
