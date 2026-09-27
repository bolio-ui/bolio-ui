import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Col, Container, Display, Row, Section } from '..'

const css = () =>
  Array.from(document.head.querySelectorAll('style'))
    .map((el) => (el.textContent || '').replace(/\s+/g, ''))
    .join('\n')

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('layout components', () => {
  it('Col takes span twelfths of the row and can be pushed with offset', () => {
    wrap(
      <Col span={6} offset={3}>
        col
      </Col>
    )
    expect(css()).toContain('width:50%')
    expect(css()).toContain('margin-left:25%')
  })

  it('Col spans the whole row by default', () => {
    wrap(<Col>col</Col>)
    expect(css()).toContain('width:100%')
    expect(css()).toContain('margin-left:0%')
  })

  it('Row is a flex row that aligns its columns', () => {
    wrap(
      <Row justify="space-between" align="bottom">
        row
      </Row>
    )
    expect(css()).toContain('display:flex')
    expect(css()).toContain('justify-content:space-between')
    expect(css()).toContain('align-items:flex-end')
  })

  it('Row gap sets the space that its columns use as padding', () => {
    wrap(<Row gap={2}>row</Row>)
    expect(css()).toMatch(/--row-gap:calc\(2\*/)
  })

  it('Row and Col can render another element', () => {
    wrap(
      <Row component="ul">
        <Col component="li">item</Col>
      </Row>
    )
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByRole('listitem')).toHaveTextContent('item')
  })

  it('Container limits and centers the content', () => {
    wrap(<Container>content</Container>)
    expect(css()).toContain('max-width:')
    expect(css()).toContain('margin-left:auto')
  })

  it('Container fluid has no maximum width and no stray CSS', () => {
    wrap(<Container fluid>content</Container>)
    expect(css()).not.toContain('max-width:')
    expect(css()).not.toContain('false')
  })

  it('Section paints its background', () => {
    wrap(<Section bg="#eee">section</Section>)
    expect(css()).toContain('background-color:#eee')
    expect(screen.getByText('section').tagName).toBe('SECTION')
  })

  it('Display shows the caption below the content', () => {
    wrap(
      <Display caption="A caption">
        <span>content</span>
      </Display>
    )
    expect(screen.getByText('content')).toBeInTheDocument()
    expect(screen.getByText('A caption')).toBeInTheDocument()
  })
})
