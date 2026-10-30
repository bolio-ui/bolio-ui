import TagsInput from '.'

export default function Example() {
  return (
    <TagsInput
      aria-label="Skills"
      placeholder="Add a skill"
      initialValue={['React', 'TypeScript']}
    />
  )
}
