import React from 'react'
import { Section, Container, Grid, Col, Text, Link } from 'core'
import CardBox from 'src/components/CardBox'
import Eyebrow from 'src/components/Eyebrow'

function SectionCommunity() {
  return (
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <Col span={8}>
          <Eyebrow>Community</Eyebrow>
          <Text h2 my={0} mb={1}>
            Everyone is welcome!
          </Text>
          <Text font={1.2} mt={0}>
            Feel free to report issues, ask questions, and meet new people.
          </Text>
        </Col>
      </Container>
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container gap={2} justify="flex-start">
          <Grid xs={12} sm={6} md={4}>
            <Link
              href="https://www.twitter.com/bolio_ui/"
              target="_blank"
              width="100%"
            >
              <CardBox
                title="Twitter"
                description="For announcements, tips and general information."
                icon="Twitter"
                hover
              />
            </Link>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Link
              href="https://github.com/bolio-ui/bolio-ui"
              target="_blank"
              width="100%"
            >
              <CardBox
                title="GitHub"
                description="For issues, feature requests, contribute and discussions."
                icon="Github"
                hover
              />
            </Link>
          </Grid>
          {/* <Grid xs={12} sm={6} md={4}>
            <Link
              href="https://www.instagram.com/bolio.ui/"
              target="_blank"
              width="100%"
            >
              <CardBox
                title="Instagram"
                description="To get involved in the community, ask questions and share tips."
                icon="Instagram"
                hover
              />
            </Link>
          </Grid> */}
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default SectionCommunity
