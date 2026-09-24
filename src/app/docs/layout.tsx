import React from 'react'
import { DocsLayout } from 'src/templates/Docs'

// Shared by every docs page, so the sidebar and Contents stay mounted
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>
}
