import * as React from 'react'
import { useKBar } from 'kbar'
import { useTheme } from 'core'
import styles from './search.module.css'

export default function KBarSearch(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const { query, search, actions, currentRootActionId } = useKBar((state) => ({
    search: state.searchQuery,
    currentRootActionId: state.currentRootActionId,
    actions: state.actions
  }))

  const theme = useTheme()
  const ownRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    query.setSearch('')
    ownRef.current?.focus()
  }, [currentRootActionId, query])

  return (
    <input
      ref={ownRef}
      {...props}
      className={styles.input}
      style={
        {
          '--search-color': theme?.palette?.foreground,
          '--search-placeholder': theme?.palette?.accents_7,
          ...props.style
        } as React.CSSProperties
      }
      value={search}
      onChange={(event) => {
        props.onChange?.(event)
        query.setSearch(event.target.value)
      }}
      onKeyDown={(event) => {
        if (currentRootActionId && !search && event.key === 'Backspace') {
          const parent = actions[currentRootActionId].parent
          query.setCurrentRootAction(parent)
        }
      }}
    />
  )
}
