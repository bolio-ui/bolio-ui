import React from 'react'
import Anchor from '../Anchor'
import { Code, useTheme } from 'core'
import styles from './attributes-title.module.css'

export interface AttributesTitleProps {
  alias?: string
}

const getAlias = (alias?: string) => {
  if (!alias) return null
  return (
    <small>
      <span>[</span>
      {'alias'}: <Code>{alias}</Code>
      <span>]</span>
    </small>
  )
}

const AttributesTitle: React.FC<React.PropsWithChildren<AttributesTitleProps>> =
  React.memo(({ children, alias }) => {
    const theme = useTheme()

    return (
      <>
        <h4
          className={`title ${styles.title}`}
          style={
            {
              '--title-gap': theme.layout.gapHalf,
              '--title-radius': theme.layout.radius,
              '--title-alias': theme.palette.accents_4,
              '--title-bracket': theme.palette.accents_6
            } as React.CSSProperties
          }
        >
          <Anchor pure>{children}</Anchor>
          {getAlias(alias)}
        </h4>
      </>
    )
  })

AttributesTitle.displayName = 'BolioUIAttributesTitle'
export default AttributesTitle
