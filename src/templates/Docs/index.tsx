import React, { useState, useEffect, useMemo } from 'react'
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

function Docs({ children, meta }: DocsTemplateProps) {
  const router = useRouter()
  const isMobile = useMediaQuery(650)

  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    setHeadings(getHeadings())
  }, [])

  const { title, description } = meta

  let pageTitle = title ? `${toCapitalize(title)} | ` : ''
  pageTitle += 'Bolio UI - Amazing, modern and creative tools for React UI'

  const homeAction: Action = React.useMemo(() => {
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

  const sidebarItems = {
    guide: guide,
    components: components,
    hooks: hooks
  }

  const items = useMemo(() => {
    return sidebarItems[meta.sidebar]
  }, [meta.sidebar])

  const currentPostIndex = items.findIndex((p) => p.name === title)
  const nextPost = items[currentPostIndex + 1] ?? null
  const prevPost = items[currentPostIndex - 1] ?? null

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
              url: '/img/cover.png',
              width: 1200,
              height: 630,
              alt: `${pageTitle}`
            }
          ]
        }}
      />
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
              <Sidebar sidebar={meta.sidebar} />
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
              {children}
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
    </>
  )
}

export default Docs
