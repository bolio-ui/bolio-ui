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
                title="Built in Components"
                description="We have provided a lot of useful build in components to make it easy."
                icon="Briefcase"
              />
            </Grid>
            <Grid xs={24} sm={12} md={8}>
              <CardBox
                title="Modern Design"
                description="Responsive, theme-based style props for building design systems with React."
                icon="Layout"
              />
            </Grid>
            <Grid xs={24} sm={12} md={8}>
              <CardBox
                title="Well Documented"
                description="Documented organized way and its customization instruction easy for all."
                icon="FileText"
              />
            </Grid>
          </Grid.Container>
        </div>
      </div>
      <style jsx>{`
        .page__wrapper {
          background-color: ${theme.palette.accents_1};
          min-height: calc(100vh - 350px);
        }
        .page__content {
          width: 100%;
          max-width: ${theme.layout.pageWidthWithMargin};
          margin-left: auto;
          margin-right: auto;
          padding: 20px 20px 50px 20px;
        }
      `}</style>
    </Base>
  )
}

export default Home
