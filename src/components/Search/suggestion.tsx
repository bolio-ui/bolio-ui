import * as React from 'react'
import cn from 'classnames'
import NextLink from 'next/link'
import { useTheme } from 'core'
import { File, Hash, ArrowRight } from '@bolio-ui/icons'
import { addColorAlpha } from 'core/utils/color'
import { includes } from 'lodash'
import { DocHit, splitMatches } from 'src/utils/local-search'
import styles from './suggestion.module.css'

interface Props {
  hit: DocHit
  query: string
  highlighted: boolean
}

const Highlighted: React.FC<{ text: string; query: string }> = ({
  text,
  query
}) => (
  <>
    {splitMatches(text, query).map((part, i) =>
      part.match ? <mark key={i}>{part.text}</mark> : part.text
    )}
  </>
)

const Suggestion: React.FC<Props> = ({ hit, query, highlighted }) => {
  const theme = useTheme()

  return (
    <NextLink
      href={hit.path}
      style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
    >
      <span
        className={cn(styles.container, { [styles.highlighted]: highlighted })}
        style={
          {
            '--suggestion-border': addColorAlpha(theme.palette.border, 0.6),
            '--suggestion-icon-gap': `calc(${theme.layout.gapQuarter} * 0.5)`,
            '--suggestion-muted': theme.palette.accents_6,
            '--suggestion-highlight': addColorAlpha(
              theme.palette.foreground,
              0.1
            ),
            '--suggestion-foreground': theme.palette.foreground
          } as React.CSSProperties
        }
      >
        <div className={styles.iconContainer}>
          {!hit.component || includes(hit.path, '#') ? (
            <Hash stroke={theme.palette.accents_6} />
          ) : (
            <File stroke={theme.palette.accents_6} />
          )}
        </div>
        <div className={styles.dataContainer}>
          {hit.head && (
            <span className={styles.title}>
              <Highlighted text={hit.head} query={query} />
            </span>
          )}
          <span className={styles.content}>
            <Highlighted text={hit.title} query={query} />
          </span>
        </div>
        <div>
          <ArrowRight stroke={theme.palette.accents_6} fontSize={16} />
        </div>
      </span>
    </NextLink>
  )
}

const SuggestionMemo = React.memo(Suggestion)

export default SuggestionMemo
