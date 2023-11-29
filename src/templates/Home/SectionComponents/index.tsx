import React from 'react'
import { Grid, Row, Col, Spacer } from 'core'
import {
  Search,
  Toogle,
  InfoCard,
  FollowersCard,
  Player,
  ButtonLoading,
  InfoUsersCard
} from 'src/components/HeroComponents'

function SectionComponents() {
  return (
    <Grid.Container gap={2}>
      <Grid xs={12} md={6}>
        <Player />
      </Grid>
      <Grid xs={12} md={6}>
        <Col>
          <Row justify="space-around">
            <ButtonLoading />
            <Spacer w={1} />
            <Search />
            <Spacer w={1} />
            <Toogle />
          </Row>
          <Spacer h={0.6} />
          <Row>
            <InfoCard
              title="Calories"
              quantity="2.5k"
              info="CAL"
              icon="Smile"
              src="https://bolio-nextjs.vercel.app/_next/static/images/4-f644322437d168b27aea6b8198d9c020.jpg"
            />
            <Spacer w={2} />
            <InfoUsersCard
              title="Start coding"
              subtitle="Get started with Bolio UI"
              src="https://bolio-nextjs.vercel.app/_next/static/images/2-5314bc1e7cf441777a9a9d237911fc98.jpg"
            />
          </Row>
          <Spacer h={1} />
          <FollowersCard />
        </Col>
      </Grid>
    </Grid.Container>
  )
}

export default SectionComponents
