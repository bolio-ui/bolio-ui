import * as React from 'react'
import { createPortal } from 'react-dom'
import cn from 'classnames'
import { isMacOs } from 'react-device-detect'
import { useRouter } from 'next/router'
import { useTheme, useBodyScroll, useClickAway, Keyboard } from 'core'
import AutoSuggest, {
  ChangeEvent,
  OnSuggestionSelected,
  RenderSuggestionsContainerParams,
  RenderInputComponentProps
} from 'react-autosuggest'
import { SearchByAlgolia, Close } from 'src/components/Icons'
import { addColorAlpha } from 'core/utils/color'
import {
  connectAutoComplete,
  connectStateResults
} from 'react-instantsearch-dom'
import { isEmpty } from 'lodash'
import { AutocompleteProvided } from 'react-instantsearch-core'
import Suggestion from './suggestion'
import { VisualState, useKBar } from 'kbar'
import Blockholder from 'src/components/Blockholder'
import useIsMounted from 'src/utils/use-is-mounted'
import usePortal from 'core/utils/use-portal'
import withDeaults from 'src/utils/with-defaults'
import { useIsMobile } from 'src/utils/use-media-query'

interface Props extends AutocompleteProvided {
  offsetTop?: number
}

const defaultProps = {
  offsetTop: 0
}

interface SuggestionsFetchRequestedParams {
  value: string
}

interface OnSuggestionSelectedParams {
  url: string
}

const Autocomplete: React.FC<Props> = ({ hits, refine, offsetTop }) => {
  const theme = useTheme()

  const [value, setValue] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true })
  const router = useRouter()

  const suggestionsPortal = usePortal('suggestions', () => {
    return document?.getElementById('navbar-container')
  })

  const noResultsPortal = usePortal('no-results', () => {
    return document?.getElementById('navbar-container')
  })

  const isMobile = useIsMobile()

  const { query } = useKBar()
  const isMounted = useIsMounted()

  const inputRef = React.useRef<HTMLInputElement>(null)

  useClickAway(inputRef, () => {
    setIsFocused(false)
    inputRef && inputRef?.current?.blur()
  })

  React.useEffect(() => {
    if (isMobile) {
      const isOpen = !isEmpty(
        document.getElementsByClassName(
          'react-autosuggest__suggestions-container--open'
        )
      )
      const noResults = isEmpty(hits) && !isEmpty(value)
      setBodyHidden(isFocused && (isOpen || noResults))
    } else {
      setBodyHidden(false)
    }
  }, [hits, value, isFocused, isMobile, setBodyHidden])

  const onChange = (_: unknown, { newValue }: ChangeEvent) => {
    setValue(newValue)
  }

  const inputProps = {
    value,
    onChange,
    ref: inputRef,
    type: 'search',
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false)
  }

  const onSuggestionsFetchRequested = ({
    value
  }: SuggestionsFetchRequestedParams) => {
    refine(value)
  }

  const onSuggestionSelected: OnSuggestionSelected<OnSuggestionSelectedParams> =
    (_, { suggestion, method }) => {
      if (method === 'enter') {
        onClear()
        router.push(suggestion.url)
      }
    }

  const getSuggestionValue = () => value

  const renderSuggestion = (
    hit,
    { isHighlighted }: { isHighlighted: boolean }
  ) => <Suggestion highlighted={isHighlighted} hit={hit} />

  const onClear = () => {
    refine()
    setValue('')
    inputRef && inputRef?.current?.blur()
  }

  const renderInput = React.useCallback(
    (inputProps: RenderInputComponentProps) => {
      const onClear = () => {
        refine()
        setValue('')
        inputRef && inputRef?.current?.blur()
      }

      const handleKeyboardClick = () => {
        query.setVisualState((vs) =>
          [VisualState.animatingOut, VisualState.hidden].includes(vs)
            ? VisualState.animatingIn
            : VisualState.animatingOut
        )
      }

      return (
        <label className="search__input-container">
          <input
            className="search__input"
            {...inputProps}
            placeholder="Search..."
          />
          {!value ? (
            <span className="search__placeholder-container">
              <Keyboard
                className="search__placeholder-kbd"
                command={isMacOs}
                ctrl={!isMacOs}
                onClick={handleKeyboardClick}
              >
                K
              </Keyboard>
            </span>
          ) : (
            <span className="search__reset-container" onClick={onClear}>
              <Close size={16} fill={theme.palette.accents_6} />
            </span>
          )}
        </label>
      )
    },
    [value, theme.palette.accents_6, refine, query]
  )

  const renderSuggestionsContainer = ({
    containerProps,
    children
  }: RenderSuggestionsContainerParams) =>
    suggestionsPortal ? (
      createPortal(
        <div className={'suggest__suggestion-sticky'}>
          <div {...containerProps}>
            <a
              href="https://www.algolia.com/"
              target="_blank"
              rel="noreferrer"
              className="react-autosuggest__suggestions-header"
            >
              <SearchByAlgolia fill={theme.palette.accents_6} />
            </a>
            {children}
          </div>
        </div>,
        suggestionsPortal
      )
    ) : (
      <div {...containerProps}>
        <a
          href="https://www.algolia.com/"
          target="_blank"
          rel="noreferrer"
          className="react-autosuggest__suggestions-header"
        >
          <SearchByAlgolia fill={theme.palette.accents_6} />
        </a>
        {children}
      </div>
    )

  const NoResults = connectStateResults(
    ({ searchState, searchResults, searching }) => {
      const open =
        searchState &&
        searchState.query &&
        !searching &&
        searchResults &&
        searchResults.nbHits === 0
      const NoResultsContainer = () => (
        <div className={'suggest__suggestion-sticky'}>
          <div className="no-results">
            <span>
              No results for <span>"{value}"</span>
            </span>
            <br />
            <span>Try again with a different keyword</span>
          </div>
        </div>
      )
      // if (accents_0 && open) {
      //   if (!noResultsPortal) return null
      //   return createPortal(<NoResultsContainer />, noResultsPortal)
      // }
      if (open) {
        if (!noResultsPortal) return null
        return createPortal(<NoResultsContainer />, noResultsPortal)
      }
      return open ? <NoResultsContainer /> : null
    }
  )

  if (!isMounted) {
    return (
      <>
        <Blockholder
          className="search__placeholder-block"
          alt="search placeholder"
          height="38px"
        />
        <style jsx global>{`
          .search__placeholder-block {
            max-width: 200px;
          }
          @media only screen and (max-width: ${theme.breakpoints.md.max}) {
            .search__placeholder-block {
              max-width: 228px;
            }
          }
          @media only screen and (max-width: ${theme.breakpoints.xs.max}) {
            .search__placeholder-block {
              max-width: 64vw;
            }
          }
          @media only screen and (min-width: ${theme.breakpoints.xs
              .min}) and (max-width: ${theme.breakpoints.md.max}) {
            .search__placeholder-block {
              max-width: 248px;
            }
          }
        `}</style>
      </>
    )
  }

  return (
    <>
      <div
        className={cn('search__container', {
          focused: isFocused,
          'has-value': !!value.length
        })}
      >
        <AutoSuggest
          highlightFirstSuggestion={true}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onClear}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          renderInputComponent={renderInput}
          renderSuggestionsContainer={renderSuggestionsContainer}
          suggestions={hits}
          inputProps={inputProps}
        />

        <NoResults />
      </div>
      <style jsx global>{`
        .suggest__suggestion-sticky {
          z-index: 1;
          position: fixed;
          z-index: 1100;
          top: 0;
          right: 0;
          left: 0;
        }
        .search__container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .search__reset-container {
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 6;
          height: 100%;
          right: 5%;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .search__placeholder-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .search__placeholder-kbd {
          position: absolute;
          right: 4px;
        }
        :global(.search__reset-container:hover path) {
          fill: ${addColorAlpha(theme.palette?.accents_6, 0.8)};
        }
        .search__placeholder-icon {
          position: absolute;
          left: 30%;
          z-index: -1;
          transition: all 0.25s ease;
        }
        .search__container.focused .search__placeholder-icon {
          left: 0;
          opacity: 0;
        }
        .react-autosuggest__container {
          position: relative;
          z-index: 4;
          width: 100%;
        }
        .search__input-container {
          position: relative;
          display: flex;
          height: 36px;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          background: ${addColorAlpha(theme.palette.background, 0.7)};
          box-shadow: ${theme.type === 'dark'
            ? '0px 5px 20px -5px rgba(0, 0, 0, 0.1)'
            : 'none'};
          border-radius: 8px;
        }
        .react-autosuggest__input {
          text-align: left;
          background: none;
          color: ${theme.palette?.foreground};
          width: 200px;
          height: 28px;
          padding: 16px;
          padding-right: calc(5% + 18px);
          font-size: 1rem;
          outline: none;
          border: none;
        }
        @media only screen and (max-width: ${theme.breakpoints.md.max}) {
          .react-autosuggest__input {
            width: 228px;
          }
        }
        .react-autosuggest__suggestions-container {
          display: none;
          opacity: 0;
        }
        .react-autosuggest__suggestions-container,
        .no-results {
          position: absolute;
          top: 64px;
          right: 20px;
          height: 0;
          padding: 12px 0;
          overflow-y: auto;
          height: auto;
          width: 428px;
          max-height: calc(100vh - 334px);
          min-height: 168px;
          transition: all 0.25s ease;
          box-shadow: 0px 5px 20px -5px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          z-index: 99999999;
        }

        .search__input-container,
        .react-autosuggest__suggestions-container,
        .no-results {
          background: ${theme.palette.accents_1};
        }
        @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
          .search__input-container,
          .react-autosuggest__suggestions-container,
          .no-results {
            backdrop-filter: saturate(180%) blur(10px) !important;
            background: ${addColorAlpha(theme.palette.accents_1, 0.7)};
          }
        }
        .search__input-container {
          z-index: 9999;
          background: ${addColorAlpha(theme.palette.accents_2, 0.7)};
        }

        .react-autosuggest__suggestions-container::-webkit-scrollbar {
          width: 0px;
        }
        .react-autosuggest__suggestions-header {
          padding: 14px;
          width: 100%;
        }
        .react-autosuggest__suggestions-container--open {
          display: block;
          opacity: 1;
          z-index: 1001;
        }
        .react-autosuggest__suggestions-list {
          margin: 0;
          padding: 10px;
          list-style: none !important;
          list-style-type: none !important;
          overflow-y: auto;
        }
        .react-autosuggest__suggestions-list li:last-child a {
          border-bottom: none;
        }
        .react-autosuggest__section-container--first {
          border-top: 0;
        }
        .react-autosuggest__section-title {
          padding: 10px 0 0 10px;
          font-size: 12px;
          color: ${theme.palette.accents_6};
        }
        .no-results {
          z-index: 1001;
          display: flex;
          top: 60px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: ${theme.palette.accents_6};
        }
        .no-results span {
          word-break: break-all;
        }
        ::-webkit-search-cancel-button {
          display: none;
        }
        .search__input-container input:focus::placeholder {
          opacity: 0;
          transition: opacity 0.25s ease 0s;
        }
        .search__input-container input::placeholder {
          color: ${theme.palette.accents_6};
          transition: opacity 0.25s ease 0s;
          -moz-transition: opacity 0.25s ease 0s;
          -ms-transition: opacity 0.25s ease 0s;
          -webkit-transition: opacity 0.25s ease 0s;
        }
        @media only screen and (max-width: ${theme.breakpoints.xs.max}) {
          .react-autosuggest__suggestions-container,
          .no-results {
            position: fixed;
            z-index: -1;
            width: 100%;
            height: calc(100vh + 10%);
            max-height: 100vh;
            padding: 0;
            border-radius: 0;
            top: calc(20px + ${offsetTop}px);
            left: 0;
            right: 0;
          }
          .search__placeholder-kbd {
            display: none !important;
          }
          .react-autosuggest__suggestions-container {
            padding: 64px 0;
          }
          .react-autosuggest__input {
            width: 56vw;
            padding-right: 0;
          }
          .react-autosuggest__container {
            position: initial;
            z-index: 4;
          }
          .search__placeholder-container {
            position: absolute;
            z-index: -1;
            left: 0;
            right: 0;
          }
        }
        @media only screen and (min-width: ${theme.breakpoints.xs
            .min}) and (max-width: ${theme.breakpoints.lg.max}) {
          .react-autosuggest__suggestions-container,
          .no-results {
            top: 60px;
            right: 180px;
          }
          .react-autosuggest__input {
            width: 100%;
            padding-right: 0;
          }
        }
      `}</style>
    </>
  )
}

const MemoAutocomplete = React.memo(Autocomplete)

export default connectAutoComplete(withDeaults(MemoAutocomplete, defaultProps))
