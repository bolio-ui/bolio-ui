import * as React from 'react'
import { connectStateResults } from 'react-instantsearch-dom'
import { useTheme, Loading } from 'core'
import { Search, X } from '@bolio-ui/icons'

export interface InputProps {
  value: string
  onClear: () => void
  searching: boolean
}

const Input: React.FC<InputProps> = ({
  onClear,
  value,
  searching,
  ...inputProps
}) => {
  const theme = useTheme()

  return (
    <div className="search__input-container">
      <input {...inputProps} value={value} />
      {!value ? (
        <span className="search__placeholder-container">
          <Search
            fontSize={16}
            fill={theme.palette.accents_8}
            className="search__placeholder-icon"
          />
          <p className="search__placeholder-text">Search...</p>
        </span>
      ) : (
        <span className="search__reset-container" onClick={() => onClear()}>
          {searching ? (
            <Loading />
          ) : (
            <X fontSize={16} fill={theme.palette.accents_6} />
          )}
        </span>
      )}
    </div>
  )
}

export default connectStateResults(Input)
