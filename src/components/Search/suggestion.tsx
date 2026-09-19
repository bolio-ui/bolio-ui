import * as React from 'react'
import cn from 'classnames'
import NextLink from 'next/link'
import { useTheme } from 'core'
import { File, Hash, ArrowRight } from '@bolio-ui/icons'
import { addColorAlpha } from 'core/utils/color'
import { includes } from 'lodash'
import { DocHit, splitMatches } from 'src/utils/local-search'

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
    <NextLink href={hit.path} legacyBehavior>
      <span className={cn('suggestion__container', { highlighted })}>
        <div className="suggestion__icon-container">
          {!hit.component || includes(hit.path, '#') ? (
            <Hash stroke={theme.palette.accents_6} />
          ) : (
            <File stroke={theme.palette.accents_6} />
          )}
        </div>
        <div className="suggestion__data-container">
          {hit.head && (
            <span className="suggestion__title">
              <Highlighted text={hit.head} query={query} />
            </span>
          )}
          <span className="suggestion__content">
            <Highlighted text={hit.title} query={query} />
          </span>
        </div>
        <div>
          <ArrowRight stroke={theme.palette.accents_6} fontSize={16} />
        </div>

        <style jsx>
          {`
            .suggestion__container {
              display: flex;
              align-items: center;
              cursor: pointer;
              padding: 8px;
              justify-content: space-between;
              border-bottom: 1px solid
                ${addColorAlpha(theme.palette.border, 0.6)};
              min-height: 40px;
              transition: all 0.2s ease;
            }
            .suggestion__container,
            .suggestion__icon-container {
              display: flex;
              align-items: center;
            }
            .suggestion__icon-container {
              margin-right: calc(${theme.layout.gapQuarter} * 0.5);
            }
            .suggestion__data-container {
              width: 100%;
            }
            .suggestion__title {
              font-size: 0.735rem;
              line-height: 2px;
              font-weight: 500;
              margin-bottom: 4px;
              margin-left: 5px;
              display: flex;
              color: ${theme.palette.accents_6};
            }
            .suggestion__container:hover,
            .suggestion__container.highlighted {
              border-radius: 4px;
              background: ${addColorAlpha(theme.palette.foreground, 0.1)};
            }
            .suggestion__container:active {
              transform: scale(0.97);
            }
            :global(.suggestion__title mark) {
              background-color: transparent;
              color: ${theme.palette.accents_6};
            }
            .suggestion__content {
              font-size: 0.875rem;
              display: block;
              line-height: 1.4;
              color: ${theme.palette.accents_6};
              margin-left: 5px;
            }
            :global(.suggestion__content mark) {
              background-color: transparent;
              color: ${theme.palette.foreground};
            }
          `}
        </style>
      </span>
    </NextLink>
  )
}

const SuggestionMemo = React.memo(Suggestion)

export default SuggestionMemo
