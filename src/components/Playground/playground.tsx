import React from 'react'
import dynamic from 'next/dynamic'
import { Loading, useTheme } from 'core'
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
  const theme = useTheme()

  const code = inputCode.trim()
  const title = inputTitle || 'General'

  return (
    <>
      <Title title={title} desc={desc} />
      <DynamicLive code={code} scope={scope} />
      <style global jsx>{`
        pre {
          background-color: ${theme.palette.pre};
        }
        pre code {
          color: #ffffff;
        }
        .tag {
          color: ${theme.palette.error};
        }
        .punctuation {
          color: #ffffff;
        }
        .attr-name {
          color: ${theme.palette.warning};
        }
        .attr-value {
          color: ${theme.palette.error};
        }
        .language-javascript {
          color: ${theme.palette.accents_4};
        }
        .method.function.property-access {
          color: ${theme.palette.primary};
        }
        .property-access {
          color: #ffffff;
        }
        .literal-property.property {
          color: #ffffff;
        }
        .function {
          color: ${theme.palette.primary};
        }
        .parameter {
          color: #ffffff;
        }
        span.class-name {
          color: ${theme.palette.warningLighter};
        }
        span.maybe-class-name {
          color: #ffffff;
        }
        span.token.string {
          color: ${theme.palette.successLight};
        }
        span.token.comment {
          color: ${theme.palette.accents_3};
        }
        span.operator {
          color: #ffffff;
        }
        span.constant {
          color: #ffffff;
        }
        span.number {
          color: #ffffff;
        }
        span.keyword {
          color: ${theme.palette.secondaryLighter};
        }
        span.plain-text {
          color: #ffffff;
        }
      `}</style>
    </>
  )
}

Playground.defaultProps = defaultProps
Playground.displayName = 'BolioUIPlayground'
export default React.memo(Playground)
