import React, { useMemo } from 'react'
import { Spacer, Divider, Text } from 'core'
// import { VirtualAnchor } from '../Pures'
import AttributesTitle from './attributes-title'
import AttributesTable from './attributes-table'

export interface AttributesProps {
  edit: string
}

const Attributes: React.FC<React.PropsWithChildren<AttributesProps>> =
  React.memo(({ edit, children }) => {
    const apiTitles = useMemo(() => {
      if (React.Children.count(children) === 0) return null
      return (
        <>
          <Spacer h={1} />
          <h3>{/* <VirtualAnchor>APIs</VirtualAnchor> */}</h3>
          <AttributesTable>{children}</AttributesTable>
        </>
      )
    }, [children])

    return (
      <>
        {apiTitles}
        <Divider font="12px" mt="80px">
          <Text p b type="secondary" style={{ userSelect: 'none' }}>
            {'Contributors'}
          </Text>
        </Divider>
      </>
    )
  })

type AttributesComponent<P> = React.FC<P> & {
  Title: typeof AttributesTitle
  Table: typeof AttributesTable
}

Attributes.displayName = 'BolioUIAttributes'
export default Attributes as AttributesComponent<AttributesProps>
