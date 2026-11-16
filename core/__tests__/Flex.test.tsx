import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, Center, Flex, Group, SimpleGrid, Stack } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('Flex', () => {
  it('lays the children out with the given props', () => {
    wrap(
      <Flex data-testid="f" gap={2} wrap align="end" justify="space-between">
        a
      </Flex>
    )
    const el = screen.getByTestId('f')
    expect(el).toHaveStyle({
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: '2rem'
    })
  })

  it('renders the chosen element and an inline container', () => {
    wrap(
      <Flex data-testid="f" component="section" inline>
        a
      </Flex>
    )
    const el = screen.getByTestId('f')
    expect(el.tagName).toBe('SECTION')
    expect(el).toHaveStyle({ display: 'inline-flex' })
  })
})

describe('Stack', () => {
  it('stacks the children with a gap and stretches them', () => {
    wrap(<Stack data-testid="s">a</Stack>)
    expect(screen.getByTestId('s')).toHaveStyle({
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '1rem'
    })
  })
})

describe('Group', () => {
  it('puts the children in a row that wraps', () => {
    wrap(<Group data-testid="g">a</Group>)
    expect(screen.getByTestId('g')).toHaveStyle({
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center'
    })
  })

  it('gives every child an equal share with grow', () => {
    wrap(
      <Group grow>
        <span data-testid="a">a</span>
        <span data-testid="b">b</span>
      </Group>
    )
    expect(screen.getByTestId('a')).toHaveStyle({ flex: '1' })
    expect(screen.getByTestId('b')).toHaveStyle({ flex: '1' })
  })
})

describe('Center', () => {
  it('centers the content on both axes', () => {
    wrap(<Center data-testid="c">a</Center>)
    expect(screen.getByTestId('c')).toHaveStyle({
      alignItems: 'center',
      justifyContent: 'center'
    })
  })
})

describe('SimpleGrid', () => {
  it('splits the row in equal columns', () => {
    wrap(
      <SimpleGrid data-testid="g" cols={3}>
        a
      </SimpleGrid>
    )
    expect(screen.getByTestId('g').style.gridTemplateColumns).toBe(
      'repeat(3, minmax(0, 1fr))'
    )
  })

  it('fits as many columns as the minimum width allows', () => {
    wrap(
      <SimpleGrid data-testid="g" minChildWidth={200}>
        a
      </SimpleGrid>
    )
    expect(screen.getByTestId('g').style.gridTemplateColumns).toContain(
      'auto-fit'
    )
  })
})
