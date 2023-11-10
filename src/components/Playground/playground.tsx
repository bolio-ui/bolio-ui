import React from 'react'
import dynamic from 'next/dynamic'
import { Loading } from 'core'
import Title from './title'

const DynamicLive = dynamic(() => import('./dynamic-live'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => (
    <div style={{ padding: '20pt 0' }}>
      <Loading spaceRatio={5} />
    </div>
  )
})

export type PlaygroundProps = {
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

function Playground({
  title: inputTitle,
  code: inputCode,
  desc,
  scope
}: PlaygroundProps & typeof defaultProps) {
  const code = inputCode.trim()
  const title = inputTitle || 'General'

  return (
    <>
      <Title title={title} desc={desc} />
      <DynamicLive code={code} scope={scope} />
    </>
  )
}

Playground.defaultProps = defaultProps
Playground.displayName = 'BolioUIPlayground'
export default React.memo(Playground)
