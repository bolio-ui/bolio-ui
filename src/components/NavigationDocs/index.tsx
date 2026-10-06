import React from 'react'
import { useRouter } from 'next/navigation'
import { Button, useTheme } from 'core'
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@bolio-ui/icons'
import styles from './NavigationDocs.module.css'

export interface NavigationDocsProps {
  next: Docs
  previous: Docs
}

export interface Docs {
  name: string
  url: string
}

const DocsPageLink: React.FC<{
  docs: Docs
  direction: 'previous' | 'next'
}> = ({ docs, direction }) => {
  const theme = useTheme()
  const router = useRouter()
  const isPrevious = direction === 'previous'

  return (
    <Button
      type="default"
      subtle
      auto
      scale={0.75}
      className={`${styles.link} ${styles[direction]}`}
      style={
        {
          '--docs-link-hover': `${theme.palette.primary}40`
        } as React.CSSProperties
      }
      onClick={() => router.push(docs.url)}
      icon={isPrevious && <ChevronLeftIcon fontSize={14} />}
      iconRight={!isPrevious && <ChevronRightIcon fontSize={14} />}
    >
      {docs.name}
    </Button>
  )
}

function NavigationDocs({ next, previous }: NavigationDocsProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '25px 0'
      }}
    >
      {previous && previous.url && (
        <DocsPageLink docs={previous} direction="previous" />
      )}
      {next && next.url && (
        <div style={{ marginLeft: 'auto' }}>
          <DocsPageLink docs={next} direction="next" />
        </div>
      )}
    </div>
  )
}

export default NavigationDocs
