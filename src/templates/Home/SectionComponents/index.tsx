import React from 'react'
import { Section, Container, Grid, Row, Col, Spacer } from 'core'
import {
  ProfileCard,
  Search,
  ButtonIcon,
  InfoCard,
  FollowersCard,
  Player
} from 'src/components/HeroComponents'

function SectionComponents() {
  return (
    <Section>
      <Container fluid>
        <Grid.Container gap={2}>
          <Grid xs={12} md={4}>
            <ProfileCard />
          </Grid>
          <Grid xs={12} md={4}>
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
          <Grid xs={12} md={4}>
            <Player />
          </Grid>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default SectionComponents
