import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Col, Container, Display, Row, Section } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('layout components', () => {
  it('Col takes span twelfths of the row and can be pushed with offset', () => {
    wrap(
      <Col span={6} offset={3}>
        col
      </Col>
    )
    const col = screen.getByText('col')
    expect(col.style.width).toBe('50%')
    expect(col.style.marginLeft).toBe('25%')
  })

  it('Col spans the whole row by default', () => {
    wrap(<Col>col</Col>)
    const col = screen.getByText('col')
    expect(col.style.width).toBe('100%')
    expect(col.style.marginLeft).toBe('0%')
  })

  it('Row is a flex row that aligns its columns', () => {
    wrap(
      <Row justify="space-between" align="bottom">
        row
      </Row>
    )
    const row = screen.getByText('row')
    expect(row.className).toContain('row')
    expect(row.style.justifyContent).toBe('space-between')
    expect(row.style.alignItems).toBe('flex-end')
  })

  it('Row gap sets the space that its columns use as padding', () => {
    wrap(<Row gap={2}>row</Row>)
    const row = screen.getByText('row')
    expect(row.style.getPropertyValue('--row-gap')).toMatch(/calc\(2 \*/)
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
    const container = screen.getByText('content')
    expect(container.className).toContain('container')
    expect(container.style.maxWidth).not.toBe('')
  })

  it('Container fluid has no maximum width and no stray CSS', () => {
    wrap(<Container fluid>content</Container>)
    const container = screen.getByText('content')
    expect(container.style.maxWidth).toBe('')
  })

  it('Section paints its background', () => {
    wrap(<Section bg="#eee">section</Section>)
    expect(screen.getByText('section').style.backgroundColor).toBe(
      'rgb(238, 238, 238)'
    )
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
