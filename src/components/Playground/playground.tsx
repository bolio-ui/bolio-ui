import React from 'react'
import dynamic from 'next/dynamic'
import { useTheme, Loading } from 'core'
import Title from './title'

const DynamicLive = dynamic(() => import('./dynamic-live'), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => (
    <div style={{ padding: '20pt 0' }}>
      <Loading />
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

const Playground: React.FC<PlaygroundProps> = React.memo(
  ({
    title: inputTitle,
    code: inputCode,
    desc,
    scope
  }: PlaygroundProps & typeof defaultProps) => {
    const theme = useTheme()
    const code = inputCode.trim()
    const title = inputTitle || 'General'

    console.log('scope', scope)

    return (
      <>
        <Title title={title} desc={desc} />
        <div className="playground">
          <DynamicLive code={code} scope={scope} />
          <style jsx>{`
            .playground {
              width: 100%;
              border-radius: ${theme.layout.radius};
              border: 1px solid ${theme.palette.accents_2};
            }
          `}</style>
        </div>
      </>
    )
  }
)

Playground.defaultProps = defaultProps
Playground.displayName = 'BolioUIPlayground'
export default Playground
