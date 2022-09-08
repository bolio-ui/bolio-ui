import React, { useState, useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Container, Grid, useTheme } from 'core'
import { Heading, getHeadings } from 'src/utils/get-headings'
import { toCapitalize } from 'src/utils/to-capitalize'
import Sidebar from 'src/components/Sidebar'
import SidebarHeading from 'src/components/SidebarHeading'
import MadeDesigned from 'src/components/MadeDesigned'

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
  const theme = useTheme()
  const router = useRouter()

  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    setHeadings(getHeadings())
  }, [])

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
              url: '/img/cover.png',
              width: 1200,
              height: 630,
              alt: `${pageTitle}`
            }
          ]
        }}
      />
      <Container fluid className="content-wrapper">
        <Grid.Container gap={2}>
          <Grid xs={0} sm={0} md={0} lg={2}>
            <aside className="sidebar">
              <div className="content-right">
                <Sidebar sidebar={meta.sidebar} />
              </div>
            </aside>
          </Grid>
          <Grid xs={12} sm={12} md={12} lg={8}>
            <main className="main">
              {children} <MadeDesigned />
            </main>
          </Grid>
          <Grid xs={0} sm={0} md={0} lg={2}>
            <aside className="sidebar">
              <div className="content-left">
                <SidebarHeading headings={headings} />
              </div>
            </aside>
          </Grid>
        </Grid.Container>
      </Container>
      <style jsx>{`
        .main {
          max-width: 100%;
          flex-direction: column;
          flex: 0 0 100%;
        }
        .sidebar {
          flex-grow: 1;
        }
        .sidebar > .content-right {
          height: calc(100% - 2rem - 96px + var(--bolioui-page-nav-height));
          position: fixed;
          top: 85px;
          bottom: 2rem;

          width: 200px;
          -webkit-overflow-scrolling: touch;
          -webkit-flex-shrink: 0;
          z-index: 100;
        }
        .sidebar > .content-left {
          height: calc(100% - 2rem - 96px + var(--bolioui-page-nav-height));
          position: fixed;
          top: 85px;
          bottom: 2rem;

          width: 200px;
          -webkit-overflow-scrolling: touch;
          -webkit-flex-shrink: 0;
          z-index: 100;
        }
        @media only screen and (max-width: ${theme.layout.breakpointMobile}) {
          .sidebar {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default Docs
