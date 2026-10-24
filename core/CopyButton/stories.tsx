import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import CopyButton from '.'
import Button from '../Button'

export default {
  title: 'Utils/CopyButton',
  component: CopyButton
} as Meta

export const Default: StoryFn = () => (
  <CopyButton value="yarn add @bolio-ui/core">
    {({ copied, copy }) => (
      <Button auto onClick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </Button>
    )}
  </CopyButton>
)
