import React from 'react'

const withDefaults = <P, DP>(
  component: React.ComponentType<P>,
  defaultProps: DP
) => {
  type Props = Partial<DP> & Omit<P, keyof DP>
  component.defaultProps = defaultProps as unknown as Partial<P>
  return component as React.ComponentType<Props>
}

export default withDefaults
