import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import FileInput from '.'

export default {
  title: 'Data Entry/FileInput',
  component: FileInput
} as Meta

export const Default: StoryFn = () => <FileInput aria-label="Upload" />

export const Multiple: StoryFn = () => (
  <FileInput aria-label="Attachments" multiple clearable />
)

export const Accept: StoryFn = () => (
  <FileInput
    aria-label="Image"
    accept="image/*"
    placeholder="Select an image"
  />
)
