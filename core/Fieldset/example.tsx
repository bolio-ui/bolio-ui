import Fieldset from '.'

export default function Example() {
  return (
    <Fieldset>
      <Fieldset.Title>Display name</Fieldset.Title>
      <Fieldset.Subtitle>
        This is how your name appears to your team.
      </Fieldset.Subtitle>
      <Fieldset.Footer>Use up to 32 characters.</Fieldset.Footer>
    </Fieldset>
  )
}
