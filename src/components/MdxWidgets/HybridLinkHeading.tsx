import React from 'react'
import { LinkProps } from 'core'
import { kebabCase, isString } from 'lodash'
import Anchor from '../Anchor'

export type HybridLinkProps = LinkProps

const HybridLinkHeading: React.FC<HybridLinkProps> = ({
  children,
  ...props
}) => {
  return (
    <h3
      id={`${isString(children) && kebabCase(children)}`}
      data-name={children}
      className="linked-heading"
    >
      <Anchor {...props}>{children}</Anchor>
    </h3>
  )
}

export default HybridLinkHeading
