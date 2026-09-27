import * as React from 'react'
import Autocomplete from './autocomplete'

export interface Props {
  offsetTop?: number
}

const InstantSearch: React.FC<Props> = (props) => <Autocomplete {...props} />

export default InstantSearch
