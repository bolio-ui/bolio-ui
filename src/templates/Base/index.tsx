import React from 'react'
import { Page } from 'core'
import Menu from 'src/components/Navigation/menu'
import Footer from 'src/components/Footer'

export type BaseTemplateProps = {
  children: React.ReactNode
}

function Base({ children }: BaseTemplateProps) {
  return (
    <Page>
      <Page.Header>
        <Menu />
      </Page.Header>
      <Page.Content>{children}</Page.Content>

      <Footer />
    </Page>
  )
}

export default Base
