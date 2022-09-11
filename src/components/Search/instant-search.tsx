import * as React from 'react'
import {
  InstantSearch as BaseInstantSearch,
  Configure
} from 'react-instantsearch-dom'
import { useIsMobile } from 'src/utils/use-media-query'
import getAlgoliaClient from 'src/utils/get-algolia'
import Autocomplete from './autocomplete'

const searchClient = getAlgoliaClient()
const INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX

export interface Props {
  offsetTop?: number
}

const InstantSearch: React.FC<Props> = (props) => {
  const isMobile = useIsMobile()
  return (
    <BaseInstantSearch indexName={INDEX_NAME} searchClient={searchClient}>
      <Configure hitsPerPage={isMobile ? 6 : 8} />
      <Autocomplete {...props} />
    </BaseInstantSearch>
  )
}

export default InstantSearch
