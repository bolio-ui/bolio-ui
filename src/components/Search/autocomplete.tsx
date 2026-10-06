import * as React from 'react'
import { createPortal } from 'react-dom'
import cn from 'classnames'
import { isMacOs } from 'react-device-detect'
import { useRouter } from 'next/navigation'
import { useTheme, useBodyScroll, useClickAway, Keyboard } from 'core'
import { Close } from 'src/components/Icons'
import { addColorAlpha } from 'core/utils/color'
import { isEmpty } from 'lodash'
import Suggestion from './suggestion'
import { searchDocs } from 'src/utils/local-search'
import { VisualState, useKBar } from 'kbar'
import useIsMounted from 'src/utils/use-is-mounted'
import usePortal from 'core/utils/use-portal'
import { useIsMobile } from 'src/utils/use-media-query'
import styles from './autocomplete.module.css'

interface Props {
  offsetTop?: number
}

const Autocomplete: React.FC<Props> = ({ offsetTop = 0 }) => {
  const theme = useTheme()

  const [value, setValue] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const [highlighted, setHighlighted] = React.useState(0)
  const listId = React.useId()
  const [, setBodyHidden] = useBodyScroll(null, { scrollLayer: true })
  const router = useRouter()

  const suggestionsPortal = usePortal('suggestions', () => {
    return document?.getElementById('navbar-container')
  })

  const noResultsPortal = usePortal('no-results', () => {
    return document?.getElementById('navbar-container')
  })

  const isMobile = useIsMobile()
  const hits = React.useMemo(
    () => searchDocs(value, isMobile ? 6 : 8),
    [value, isMobile]
  )

  const { query } = useKBar()
  const isMounted = useIsMounted()

  const inputRef = React.useRef<HTMLInputElement>(null)

  useClickAway(inputRef, () => {
    setIsFocused(false)
    inputRef.current?.blur()
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

  const isOpen = isFocused && hits.length > 0

  // the first suggestion is highlighted again for every new search
  React.useEffect(() => setHighlighted(0), [value])

  // Leaving the field or picking a suggestion clears the search
  const onClear = () => {
    setValue('')
    inputRef.current?.blur()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') return onClear()
    if (!isOpen) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setHighlighted((index) => (index + step + hits.length) % hits.length)
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const { path } = hits[highlighted]
      onClear()
      router.push(path)
    }
  }

  const handleKeyboardClick = () => {
    query.setVisualState((vs) =>
      [VisualState.animatingOut, VisualState.hidden].includes(vs)
        ? VisualState.animatingIn
        : VisualState.animatingOut
    )
  }

  // Both lists can be portaled out of this component, so the values travel as
  // CSS custom properties on each root instead of through inheritance.
  const vars = {
    '--search-reset-hover': addColorAlpha(theme.palette?.accents_6, 0.8),
    '--search-shadow':
      theme.type === 'dark' ? '0px 5px 20px -5px rgba(0, 0, 0, 0.1)' : 'none',
    '--search-input-bg': addColorAlpha(theme.palette.accents_2, 0.7),
    '--search-foreground': theme.palette?.foreground,
    '--search-panel-bg': theme.palette.accents_1,
    '--search-panel-bg-blur': addColorAlpha(theme.palette.accents_1, 0.7),
    '--search-muted': theme.palette.accents_6,
    '--search-offset-top': `${offsetTop}px`
  } as React.CSSProperties

  const suggestions = (
    <div
      id={listId}
      role="listbox"
      aria-label="Search results"
      className={cn(styles.suggestions, {
        [styles.open]: isOpen,
        'react-autosuggest__suggestions-container--open': isOpen
      })}
      // keeps the focus in the field while a suggestion is clicked
      onMouseDown={(event) => event.preventDefault()}
    >
      {isOpen && (
        <ul className={styles.list}>
          {hits.map((hit, index) => (
            <li
              key={hit.path}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === highlighted}
              onMouseEnter={() => setHighlighted(index)}
              onClick={onClear}
            >
              <Suggestion
                highlighted={index === highlighted}
                hit={hit}
                query={value}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const NoResults = () => {
    if (!value || hits.length > 0 || !noResultsPortal) return null
    return createPortal(
      <div className={styles.sticky} style={vars}>
        <div className={styles.noResults}>
          <span>
            No results for <span>"{value}"</span>
          </span>
          <br />
          <span>Try again with a different keyword</span>
        </div>
      </div>,
      noResultsPortal
    )
  }

  return (
    <>
      <div className={styles.container} style={vars}>
        <div className={styles.autosuggest}>
          <label className={styles.inputContainer}>
            <input
              ref={inputRef}
              className={styles.input}
              type="search"
              role="combobox"
              aria-label="Search the docs"
              aria-autocomplete="list"
              aria-expanded={isOpen}
              aria-controls={listId}
              aria-activedescendant={
                isOpen ? `${listId}-${highlighted}` : undefined
              }
              autoComplete="off"
              placeholder="Search..."
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false)
                setValue('')
              }}
              onKeyDown={onKeyDown}
            />
            {!value ? (
              <span className={styles.placeholder}>
                <Keyboard
                  className={styles.kbd}
                  command={isMounted && isMacOs}
                  ctrl={!(isMounted && isMacOs)}
                  onClick={handleKeyboardClick}
                  // the server does not know the OS: shown once it is known
                  style={{
                    borderRadius: 20,
                    visibility: isMounted ? 'visible' : 'hidden'
                  }}
                >
                  K
                </Keyboard>
              </span>
            ) : (
              <span className={styles.reset} onClick={onClear}>
                <Close size={16} fill={theme.palette.accents_6} />
              </span>
            )}
          </label>
          {/* the list only opens on typing, so it is created after mount */}
          {isMounted &&
            (suggestionsPortal
              ? createPortal(
                  <div className={styles.sticky} style={vars}>
                    {suggestions}
                  </div>,
                  suggestionsPortal
                )
              : suggestions)}
        </div>

        <NoResults />
      </div>
    </>
  )
}

export default React.memo(Autocomplete)
