import React from 'react'
import { useRouter } from 'next/router'
import { Button, Grid } from 'core'
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

const DocsPageLink: React.FC<{ docs: Docs; direction: 'previous' | 'next' }> =
  ({ docs, direction }) => {
    const router = useRouter()
    const isPrevious = direction === 'previous'

    return (
      <Button
        type="primary"
        subtle
        auto
        scale={0.75}
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
    <Grid.Container gap={2} justify="center" style={{ margin: '25px 0' }}>
      <Grid xs={6} sm={6} md={6} justify="flex-start">
        {previous && previous.url && (
          <DocsPageLink docs={previous} direction="previous" />
        )}
      </Grid>
      <Grid xs={6} sm={6} md={6} justify="flex-end">
        {next && next.url && <DocsPageLink docs={next} direction="next" />}
      </Grid>
    </Grid.Container>
  )
}

export default NavigationDocs
