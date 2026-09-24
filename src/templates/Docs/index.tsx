'use client'

import React, {
  lazy,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'core'
import { Heading, getHeadings } from 'src/utils/get-headings'
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

// app/docs/layout renders this once for every /docs page, so the sidebar,
// Contents and the backgrounds update instead of remounting on every
// navigation, which was visible to the user as a flash.
export function DocsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()

  const [headings, setHeadings] = useState<Heading[]>([])

  // The segment after /docs picks the sidebar: guide, components or hooks.
  const sidebar = pathname.split('/')[2]
  const items = sidebarItems[sidebar] ?? []

  // Runs before paint, unlike useEffect, so Contents does not show the
  // previous page's headings for a beat after navigating.
  useIsomorphicLayoutEffect(() => {
    setHeadings(getHeadings())
  }, [pathname])

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
  const currentPostIndex = pages.findIndex((p) => p.url === pathname)
  const nextPost = pages[currentPostIndex + 1] ?? null
  const prevPost = pages[currentPostIndex - 1] ?? null

  return (
    <>
      {/* A dashboard-style rail: pinned to the real edge of the viewport and
          full height, not centered inside the 1300px content container —
          otherwise it floats with a huge empty gutter on wide screens. */}
      <aside className="docs-sidebar-left">
        <Sidebar sidebar={sidebar} />
      </aside>
      <div className="docs-main">
        <div className="docs-shell">
          <div className="docs-content">
            {/* key remounts only this thin wrapper on navigation, so the
                new content fades in instead of popping in abruptly. The
                sidebar, Contents and backgrounds above are unaffected. */}
            <div key={pathname} className="page-content">
              {children}
            </div>
            <NavigationDocs previous={prevPost} next={nextPost} />
          </div>
          <aside className="docs-sidebar-right">
            <div className="docs-sidebar-right-sticky">
              <SidebarHeading headings={headings} />
            </div>
          </aside>
        </div>
      </div>
      {/* Sibling of .docs-main, not a child of it — the only piece that
          keeps reaching the real right edge of the screen even past 1300px,
          while everything else caps and centers. */}
      <div className="docs-footer">
        <div className="docs-footer-inner">
          <MadeDesigned />
        </div>
      </div>
      <style jsx>{`
        .docs-sidebar-left {
          position: fixed;
          /* Above 1300px the whole shell caps and centers like the rest of
             the site, but the sidebar is position:fixed (viewport-relative,
             not container-relative) so it needs its own matching offset
             instead of a wrapping Container — a Container here can't align
             with a fixed element and reintroduces the old gap/overlap bug. */
          left: max(0px, calc((100vw - 1300px) / 2));
          top: 60px;
          bottom: 0;
          width: 260px;
          padding: 24px;
          box-sizing: border-box;
          border-right: 1px solid ${theme.palette.border};
          z-index: 2;
        }
        .docs-main {
          margin-left: calc(260px + max(0px, calc((100vw - 1300px) / 2)));
          max-width: 1040px;
        }
        .docs-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 250px;
          grid-template-areas: 'content sidebar-right';
        }
        .docs-sidebar-right {
          grid-area: sidebar-right;
          box-sizing: border-box;
          border-left: 1px solid ${theme.palette.border};
        }
        .docs-sidebar-right-sticky {
          position: sticky;
          top: 60px;
          padding: 24px;
          box-sizing: border-box;
        }
        .docs-content {
          grid-area: content;
          box-sizing: border-box;
          min-width: 0;
          padding: 30px 32px 0;
        }
        .docs-footer {
          margin-left: calc(260px + max(0px, calc((100vw - 1300px) / 2)));
          border-top: 1px solid ${theme.palette.border};
        }
        .docs-footer-inner {
          padding: ${theme.layout.gap} 24px 1.5rem;
        }
        @media (max-width: calc(${theme.breakpoints.lg.min} - 1px)) {
          .docs-sidebar-left {
            display: none;
          }
          .docs-main {
            margin-left: 0;
            max-width: none;
          }
          .docs-shell {
            grid-template-columns: minmax(0, 1fr);
            grid-template-areas: 'content';
          }
          .docs-sidebar-right {
            display: none;
          }
          .docs-content {
            padding: 30px 16px 0;
          }
          .docs-footer {
            margin-left: 0;
          }
          .docs-footer-inner {
            padding: ${theme.layout.gap} 16px 2rem;
          }
        }
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

// Each MDX page ends with `export default Docs.withMeta(meta)`. The meta is
// read for the <head> by app/docs/[section]/[slug]/page, so here the page is
// only rendered.
function Docs({ children }: DocsTemplateProps) {
  return <>{children}</>
}

// The MDX language server cannot parse JSX inside an export, so pages
// export the layout with `export default Docs.withMeta(meta)` instead.
Docs.withMeta = (meta: Meta) =>
  function DocsPage({ children }: Pick<DocsTemplateProps, 'children'>) {
    return <Docs meta={meta}>{children}</Docs>
  }

export default Docs

// One lazy component per page, created once, so a page is not remounted when
// the layout renders again. The MDX files use hooks, so they load in the
// browser; the page is still rendered on the server.
const docsPages: Record<string, React.ComponentType> = {}

export function DocsContent({
  section,
  slug
}: {
  section: string
  slug: string
}) {
  const key = `${section}/${slug}`
  if (!docsPages[key]) {
    docsPages[key] = lazy(
      () => import(`../../content/docs/${section}/${slug}.mdx`)
    )
  }
  const Content = docsPages[key]
  return <Content />
}
