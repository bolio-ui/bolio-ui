import React from 'react'
import { useRouter } from 'next/navigation'
import { Button, useTheme } from 'core'
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@bolio-ui/icons'

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
  const router = useRouter()
  const isPrevious = direction === 'previous'

  return (
    <Button
      type="primary"
      subtle
      auto
      scale={0.75}
      className={`docs-page-link ${direction}`}
      onClick={() => router.push(docs.url)}
      icon={isPrevious && <ChevronLeftIcon fontSize={14} />}
      iconRight={!isPrevious && <ChevronRightIcon fontSize={14} />}
    >
      {docs.name}
    </Button>
  )
}

function NavigationDocs({ next, previous }: NavigationDocsProps) {
  const theme = useTheme()

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
      <style jsx>{`
        :global(.docs-page-link.btn) {
          transition:
            background-color 200ms ease,
            transform 200ms ease;
        }
        :global(.docs-page-link.btn:hover) {
          background-color: ${theme.palette.primary}40;
          transform: translateY(-1px);
        }
        :global(.docs-page-link.btn svg) {
          transition: transform 200ms ease;
        }
        :global(.docs-page-link.previous.btn:hover svg) {
          transform: translateX(-3px);
        }
        :global(.docs-page-link.next.btn:hover svg) {
          transform: translateX(3px);
        }
      `}</style>
    </div>
  )
}

export default NavigationDocs
