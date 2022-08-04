import React from 'react'
import Base from 'src/templates/Base'
import Hero from 'src/components/Hero'
import CardBox from 'src/components/CardBox'
import { Grid, useTheme } from 'core'

function Home() {
  const theme = useTheme()

  return (
    <Base>
      <Hero
        content={{
          title: 'Bolio UI',
          description:
            'Make your development more creative and dynamic with amazing tools for React. 🥷🏼'
        }}
      />
      <div className="page__wrapper">
        <div className="page__content">
          <Grid.Container gap={2} marginTop={1} justify="flex-start">
            <Grid xs={24} sm={12} md={8}>
              <CardBox
                projectId="react-dashboard-design"
                framework="next"
                git={{
                  repo: 'ofekashery/react-dashboard-design',
                  commitMessage: 'Bump version'
                }}
                updatedAt="4m"
              />
            </Grid>
            <Grid xs={24} sm={12} md={8}>
              <CardBox
                projectId="personal-website"
                framework="react"
                productionHostname="ofek.ashery.me"
                git={{
                  repo: 'ofekashery/personal-website',
                  commitMessage: 'Improve homepage layout on smaller screens'
                }}
                updatedAt="2d"
              />
            </Grid>
            <Grid xs={24} sm={12} md={8}>
              <CardBox projectId="docs" framework="other" updatedAt="5d" />
            </Grid>
          </Grid.Container>
        </div>
      </div>
      <style jsx>{`
        .page__wrapper {
          background-color: ${theme.palette.accents_1};
          min-height: calc(100vh - 172px);
        }
        .page__content {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: ${theme.layout.pageWidthWithMargin};
          max-width: 100%;
          margin: 0 auto;
          padding: calc(${theme.layout.unit} * 2) ${theme.layout.pageMargin};
          box-sizing: border-box;
        }
      `}</style>
    </Base>
  )
}

export default Home
