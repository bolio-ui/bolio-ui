import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import ModalsProvider, { useModals } from '.'
import Button from '../Button'

export default {
  title: 'Feedback/ModalsProvider',
  component: ModalsProvider
} as Meta

const Demo = () => {
  const modals = useModals()
  return (
    <>
      <Button
        onClick={() =>
          modals.open({ title: 'Welcome', children: 'Hello from a modal.' })
        }
      >
        Open
      </Button>
      <Button
        onClick={() =>
          modals.openConfirm({
            title: 'Sure?',
            children: 'Pick one.',
            onConfirm: () => console.log('confirmed')
          })
        }
      >
        Confirm
      </Button>
    </>
  )
}

export const Default: StoryFn = () => (
  <ModalsProvider>
    <Demo />
  </ModalsProvider>
)
