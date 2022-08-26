import React, { useState, useEffect } from 'react'
import { Page, Container, Grid, useTheme } from 'core'
import { Heading, getHeadings } from 'src/utils/get-headings'
import Menu from 'src/components/Navigation'
import Sidebar from 'src/components/Sidebar'
import SidebarHeading from 'src/components/SidebarHeading'
import MadeDesigned from 'src/components/MadeDesigned'

export interface Meta {
  title: string
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
  const [headings, setHeadings] = useState<Heading[]>([])

  useEffect(() => {
    setHeadings(getHeadings())
  }, [])

  return (
    <Page>
      <Page.Header>
        <Menu />
      </Page.Header>
      <Page.Content>
        <Container fluid>
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
      </Page.Content>
    </Page>
  )
}

export default Docs
