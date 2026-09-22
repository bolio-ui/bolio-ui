import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Container, Grid, Image } from 'core'
import { Heading, getHeadings } from 'src/utils/get-headings'
import { toCapitalize } from 'src/utils/to-capitalize'
import { useMediaQuery } from 'src/utils/use-media-query'
import { Action, useRegisterActions } from 'kbar'
import { getId } from 'core/utils/collections'
import Sidebar from 'src/components/Sidebar'
import SidebarHeading from 'src/components/SidebarHeading'
import MadeDesigned from 'src/components/MadeDesigned'
import NavigationDocs from 'src/components/NavigationDocs'
import { guide, components, hooks } from 'src/data/sidebar'

export interface Meta {
  title: string
  description: string
  sidebar: string
  group: string
  index: number
}

export type DocsTemplateProps = {
  children: React.ReactNode
  meta: Meta
}

const sidebarItems = {
  guide: guide,
  components: components,
  hooks: hooks
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// _app renders this once for every /docs page (see isDocsRoute), so the
// sidebar, Contents and the backgrounds update instead of remounting on
// every navigation, which was visible to the user as a flash.
export function DocsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isMobile = useMediaQuery(650)

  const [headings, setHeadings] = useState<Heading[]>([])

  // The segment after /docs picks the sidebar: guide, components or hooks.
  const sidebar = router.asPath.split('/')[2]
  const items = sidebarItems[sidebar] ?? []

  // Runs before paint, unlike useEffect, so Contents does not show the
  // previous page's headings for a beat after navigating.
  useIsomorphicLayoutEffect(() => {
    setHeadings(getHeadings())
  }, [router.asPath])

  const homeAction: Action = useMemo(() => {
    return {
      id: getId(),
      name: 'Go Home',
      section: 'Scope',
      icon: 'Home',
      shortcut: [],
      keywords: 'home, return, back, landing, page, init, initial',
      children: [],
      perform: () => router.push('/')
    }
  }, [router])

  useRegisterActions([homeAction].filter(Boolean))

  // Group headings have no url and external links leave the docs
  const pages = items.filter((p) => p.url && !('target' in p))
  const currentPostIndex = pages.findIndex((p) => p.url === router.asPath)
  const nextPost = pages[currentPostIndex + 1] ?? null
  const prevPost = pages[currentPostIndex - 1] ?? null

  return (
    <>
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container justify="center">
          <Grid xs={0} sm={0} md={0} lg={2}>
            <aside
              style={{
                height:
                  'calc(100% - 2rem - 96px + var(--bolioui-page-nav-height))',
                position: 'fixed',
                top: '80px',
                bottom: '2rem',
                width: '250px',
                marginTop: '10px',
                zIndex: 2
              }}
            >
              <Sidebar sidebar={sidebar} />
            </aside>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={8}>
            <div
              style={{
                width: isMobile ? '95%' : '80%',
                margin: '0 auto',
                marginTop: '30px',
                zIndex: 2
              }}
            >
              {/* key remounts only this thin wrapper on navigation, so the
                  new content fades in instead of popping in abruptly. The
                  sidebar, Contents and backgrounds above are unaffected. */}
              <div key={router.asPath} className="page-content">
                {children}
              </div>
              <NavigationDocs previous={prevPost} next={nextPost} />
              <MadeDesigned />
            </div>
          </Grid>
          <Grid xs={0} sm={0} md={0} lg={2}>
            <aside
              style={{
                height:
                  'calc(100% - 2rem - 96px + var(--bolioui-page-nav-height))',
                position: 'fixed',
                top: '80px',
                bottom: '2rem',
                marginTop: '10px',
                width: '250px',
                zIndex: 2
              }}
            >
              <SidebarHeading headings={headings} />
            </aside>
          </Grid>
        </Grid.Container>
      </Container>
      {isMobile ? (
        <>
          <Image
            src="/img/png/home/hero-bg.png"
            alt="docs background gradient blue"
            draggable={false}
            style={{
              position: 'fixed',
              top: '-10%',
              right: '-35%',
              zIndex: 0
            }}
          />
          <Image
            src="/img/png/home/hero-bg.png"
            alt="docs background gradient violet"
            draggable={false}
            style={{
              position: 'fixed',
              top: '45%',
              left: '-35%',
              zIndex: 0
            }}
          />
        </>
      ) : (
        <>
          <Image
            src="/img/png/home/hero-bg.png"
            alt="docs background gradient blue"
            draggable={false}
            style={{
              position: 'fixed',
              bottom: '-50%',
              top: '-40%',
              right: '-10%',
              zIndex: 0
            }}
          />
          <Image
            src="/img/png/home/hero-bg.png"
            alt="docs background gradient violet"
            draggable={false}
            style={{
              position: 'fixed',
              bottom: '-50%',
              left: '-20%',
              right: '-50%',
              zIndex: 0
            }}
          />
        </>
      )}
      <style jsx>{`
        .page-content {
          animation: fadeIn 180ms ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .page-content {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}

// Every page's SEO tags, the only part that still needs to change on each
// navigation. The sidebar shell (DocsLayout) is rendered once by _app, so it
// is not recreated here.
function Docs({ children, meta }: DocsTemplateProps) {
  const router = useRouter()
  const { title, description } = meta

  let pageTitle = title ? `${toCapitalize(title)} | ` : ''
  pageTitle += 'Bolio UI - Amazing, modern and creative tools for React UI'

  return (
    <>
      <NextSeo
        title={pageTitle}
        description={description}
        openGraph={{
          url: `${router.pathname}`,
          title: pageTitle,
          description: description,
          images: [
            {
              url: '/cover.jpg',
              width: 1200,
              height: 630,
              alt: `${pageTitle}`
            }
          ]
        }}
      />
      {children}
    </>
  )
}

// The MDX language server cannot parse JSX inside an export, so pages
// export the layout with `export default Docs.withMeta(meta)` instead.
Docs.withMeta = (meta: Meta) =>
  function DocsPage({ children }: Pick<DocsTemplateProps, 'children'>) {
    return <Docs meta={meta}>{children}</Docs>
  }

export default Docs
