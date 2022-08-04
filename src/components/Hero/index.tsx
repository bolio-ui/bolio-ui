import React from 'react'
import { Text, Grid, useTheme } from 'core'

interface Props {
  content: { title: string; description: string }
}

export type HeroProps = Props

function Hero({ content }: Props) {
  const theme = useTheme()

  return (
    <>
      <div className="container">
        <Grid>
          <Text h1>{content.title}</Text>
          <Text p font={1.5}>
            {content.description}
          </Text>
        </Grid>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
          max-width: ${theme.layout.pageWidthWithMargin};
          margin-left: auto;
          margin-right: auto;
          padding: 0 ${theme.layout.pageMargin};
          border: 1px solid red;
        }
      `}</style>
    </>
  )
}

export default Hero
