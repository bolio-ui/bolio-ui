import Mention from '.'

const people = [
  { value: 'ana', label: 'Ana Souza' },
  { value: 'bruno', label: 'Bruno Lima' }
]

export default function Example() {
  return (
    <Mention
      aria-label="Comment"
      placeholder="Write a comment and type @ to mention someone"
      options={people}
    />
  )
}
