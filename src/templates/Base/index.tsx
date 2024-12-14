import React from 'react'
import { Page, Image } from 'core'
import { useMediaQuery } from 'src/utils/use-media-query'
import Footer from 'src/components/Footer'

export type BaseTemplateProps = {
  children: React.ReactNode
}

function Base({ children }: BaseTemplateProps) {
  const isMobile = useMediaQuery(650)

  return (
    <>
      <Page style={{ zIndex: 1 }}>
        <Page.Content>{children}</Page.Content>
        <Page.Footer>
          <Footer />
        </Page.Footer>
      </Page>
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

export default Base
