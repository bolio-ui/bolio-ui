import React from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import AppShell from '.'

export default {
  title: 'Layout/AppShell',
  component: AppShell
} as Meta

export const Default: StoryFn = () => (
  <AppShell height={320}>
    <AppShell.Header height={48} style={{ padding: '0 16px' }}>
      Header
    </AppShell.Header>
    <AppShell.Navbar width={160} style={{ padding: 16 }}>
      Navbar
    </AppShell.Navbar>
    <AppShell.Main style={{ padding: 16 }}>Main</AppShell.Main>
    <AppShell.Aside width={160} style={{ padding: 16 }}>
      Aside
    </AppShell.Aside>
    <AppShell.Footer height={40} style={{ padding: '0 16px' }}>
      Footer
    </AppShell.Footer>
  </AppShell>
)
