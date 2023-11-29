import React from 'react'
import { Grid, Row, Col, Spacer } from 'core'
import {
  Search,
  Toogle,
  InfoCard,
  FollowersCard,
  Player,
  ButtonLoading
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
            />
            <Spacer w={2} />
            <InfoCard
              title="Avg Heart Rate"
              quantity="78"
              info="BPM"
              icon="Heart"
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
