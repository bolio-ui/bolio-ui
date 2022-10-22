import { Story, Meta } from '@storybook/react'
import Fieldset from '.'
import Button from '../button'
import Text from '../text'
import Divider from '../divider'
import Grid from '../grid'

export default {
  title: 'Surface/Fieldset',
  component: Fieldset
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Fieldset>
        <Fieldset.Title>Try React </Fieldset.Title>
        <Fieldset.Subtitle>
          React has been designed from the start for gradual adoption, and you
          can use as little or as much React as you need. Whether you want to
          get a taste of React, add some interactivity to a simple HTML page, or
          start a complex React-powered app, the links in this section will help
          you get started.
        </Fieldset.Subtitle>
        <Fieldset.Footer>
          Try React
          <Button auto scale={1 / 3} font="12px">
            Confirm
          </Button>
        </Fieldset.Footer>
      </Fieldset>
    </Grid>
  </Grid.Container>
)

export const CustomText: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Fieldset>
        <Fieldset.Title>Add React to a Website </Fieldset.Title>
        <Fieldset.Subtitle>
          You can add React to an HTML page in one minute. You can then either
          gradually expand its presence, or keep it contained to a few dynamic
          widgets
        </Fieldset.Subtitle>
        <Fieldset.Footer>
          <Text type="error">An error has occurred.</Text>
          <Button auto scale={1 / 3} type="error" font="12px">
            Cancel
          </Button>
        </Fieldset.Footer>
      </Fieldset>
    </Grid>
  </Grid.Container>
)

export const Tabs: Story = () => {
  const handler = (v: string) => console.log(v)
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Fieldset.Group value="create new react app" onChange={handler}>
          <Fieldset label="create new react app">
            <Fieldset.Title>Create a New React App</Fieldset.Title>
            <Fieldset.Subtitle>
              When starting a React project, a simple HTML page with script tags
              might still be the best option. It only takes a minute to set up!
            </Fieldset.Subtitle>
            <Fieldset.Footer>
              Create a New React App
              <Button auto scale={1 / 3} font="12px">
                Functions
              </Button>
            </Fieldset.Footer>
          </Fieldset>
          <Fieldset label="learn react">
            <Fieldset.Title>Learn React</Fieldset.Title>
            <Fieldset.Subtitle>
              People come to React from different backgrounds and with different
              learning styles. Whether you prefer a more theoretical or a
              practical approach, we hope you’ll find this section helpful.
            </Fieldset.Subtitle>
            <Fieldset.Footer>
              Learn React
              <Button auto scale={1 / 3} font="12px">
                Functions
              </Button>
            </Fieldset.Footer>
          </Fieldset>
          <Fieldset label="first examples">
            <Fieldset.Title>First Examples</Fieldset.Title>
            <Fieldset.Subtitle>
              The React homepage contains a few small React examples with a live
              editor. Even if you don’t know anything about React yet, try
              changing their code and see how it affects the result.
            </Fieldset.Subtitle>
            <Fieldset.Footer>
              First Examples
              <Button auto scale={1 / 3} font="12px">
                Functions
              </Button>
            </Fieldset.Footer>
          </Fieldset>
        </Fieldset.Group>
      </Grid>
    </Grid.Container>
  )
}

export const WithDivider: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Fieldset>
        <Fieldset.Content style={{ paddingTop: '10pt', paddingBottom: '10pt' }}>
          <h4>React</h4>
        </Fieldset.Content>
        <Divider my={0} />
        <Fieldset.Content>
          <Fieldset.Title>For Beginners</Fieldset.Title>
          <p>
            If you feel that the React documentation goes at a faster pace than
            you’re comfortable with, check out this overview of React by Tania
            Rascia. It introduces the most important React concepts in a
            detailed, beginner-friendly way. Once you’re done, give the
            documentation another try!
          </p>
        </Fieldset.Content>
        <Fieldset.Footer>
          <small>JavaScript Resources </small>
        </Fieldset.Footer>
      </Fieldset>
    </Grid>
  </Grid.Container>
)
