import React, { useMemo } from 'react'
import { Spacer, Link } from 'core'
import Anchor from '../Anchor'
import AttributesTitle from './attributes-title'
import AttributesTable from './attributes-table'
import { kebabCase, isString } from 'lodash'
import { GITHUB_URL } from 'src/utils/constants'

export interface AttributesProps {
  edit?: string
}

const Attributes: React.FC<React.PropsWithChildren<AttributesProps>> =
  React.memo(({ edit, children }) => {
    const path = edit?.replace('/pages', 'src/pages')

    const GITHUB_MASTER_URL = `${GITHUB_URL}/blob/master`
    const link = useMemo(
      () => `${GITHUB_MASTER_URL}/${path || 'src/pages'}`,
      [GITHUB_MASTER_URL, path]
    )

    const apiTitles = useMemo(() => {
      if (React.Children.count(children) === 0) return null
      return (
        <>
          <Spacer h={3} />
          <h3
            id={`${isString('APIs') && kebabCase('APIs')}`}
            data-name={'APIs'}
            className="linked-heading"
          >
            <Anchor>APIs</Anchor>
          </h3>
          <Spacer h={0.5} />
          <AttributesTable>{children}</AttributesTable>
        </>
      )
    }, [children])

    return (
      <>
        {apiTitles}
        <Link
          href={link}
          color
          target="_blank"
          rel="nofollow"
          mt={2}
          font={0.75}
          style={{ userSelect: 'none' }}
        >
          Edit this page on GitHub
        </Link>
      </>
    )
  })

type AttributesComponent<P> = React.FC<P> & {
  Title: typeof AttributesTitle
  Table: typeof AttributesTable
}

Attributes.displayName = 'BolioUIAttributes'
export default Attributes as AttributesComponent<AttributesProps>
