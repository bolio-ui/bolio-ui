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
              src="/img/jpg/home/img3.jpg"
            />
            <Spacer w={2} />
            <InfoUsersCard
              title="Start coding"
              subtitle="Get started with Bolio UI"
              src="/img/jpg/home/img4.jpg"
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
