import React from 'react'

export interface SplitterPanelConfig {
  id: string
  setElement: (element: HTMLDivElement | null) => void
}

export const SplitterPanelContext =
  React.createContext<SplitterPanelConfig | null>(null)
