import React from 'react'
import { Grid, Row, Col, Spacer } from 'core'
import {
  Search,
  ButtonIcon,
  InfoCard,
  FollowersCard,
  Player
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
            <Search />
            <Spacer w={1} />
            <ButtonIcon />
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
