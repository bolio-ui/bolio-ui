import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Diff from '.'

export default {
  title: 'Data Display/Diff',
  component: Diff
} as Meta

const previousValue = 'one\ntwo\nthree\nfour\nfive\nsix'
const currentValue = 'one\ntwo\n3\nfour\nfive\nsix\nseven'

export const Unified: StoryFn = () => (
  <Diff previousValue={previousValue} currentValue={currentValue} />
)

export const Split: StoryFn = () => (
  <Diff
    mode="split"
    previousValue={previousValue}
    currentValue={currentValue}
  />
)

export const WithContext: StoryFn = () => (
  <Diff
    contextLines={1}
    previousValue={previousValue}
    currentValue={currentValue}
  />
)
