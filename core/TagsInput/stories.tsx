import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import TagsInput from '.'

export default {
  title: 'Data Entry/TagsInput',
  component: TagsInput
} as Meta

export const Default: StoryFn = () => (
  <TagsInput
    aria-label="Skills"
    placeholder="Add a skill"
    initialValue={['React', 'TypeScript']}
  />
)

export const Controlled: StoryFn = () => {
  const [tags, setTags] = useState<Array<string>>(['design'])
  return (
    <TagsInput value={tags} onChange={setTags} max={4}>
      Topics
    </TagsInput>
  )
}

export const Error: StoryFn = () => (
  <TagsInput error errorMessage="Add at least one tag." aria-label="Tags" />
)

export const Disabled: StoryFn = () => (
  <TagsInput disabled initialValue={['one', 'two']} aria-label="Tags" />
)
