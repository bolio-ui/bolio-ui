import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider } from 'core'
import SectionAgents from '..'

const setup = () =>
  render(
    <BolioUIProvider>
      <SectionAgents />
    </BolioUIProvider>
  )

describe('<SectionAgents />', () => {
  it('starts on the documentation prompt', () => {
    setup()
    expect(
      screen.getByText(/Use the Bolio UI documentation from/)
    ).toBeInTheDocument()
  })

  it('shows the command of the tab picked', () => {
    setup()
    fireEvent.click(screen.getByRole('radio', { name: 'MCP server' }))
    expect(screen.getByText(/claude mcp add bolio-ui/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('radio', { name: 'AGENTS.md' }))
    expect(screen.getByText(/agents-md/)).toBeInTheDocument()
    expect(screen.queryByText(/claude mcp add/)).toBeNull()
  })

  it('links to the guide', () => {
    setup()
    expect(
      screen.getByRole('link', { name: /Learn more about UI for Agents/ })
    ).toHaveAttribute('href', '/docs/guide/llms-txt')
  })
})
