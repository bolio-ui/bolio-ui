import React from 'react'
import { Page } from 'core'
import Footer from 'src/components/Footer'

export type BaseTemplateProps = {
  children: React.ReactNode
}

function Base({ children }: BaseTemplateProps) {
  return (
    <Page>
      <Page.Content>{children}</Page.Content>
      <Page.Footer>
        <Footer />
      </Page.Footer>
    </Page>
  )
}

export default Base
