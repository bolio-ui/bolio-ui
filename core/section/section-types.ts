import { tuple } from '../utils/prop-types'

const justify = tuple(
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly'
)

export type SectionJustify = typeof justify[number]

const alignItems = tuple(
  'flex-start',
  'center',
  'flex-end',
  'stretch',
  'baseline'
)

export type SectionAlignItems = typeof alignItems[number]

const alignContent = tuple(
  'stretch',
  'center',
  'flex-start',
  'flex-end',
  'space-between',
  'space-around'
)

export type SectionAlignContent = typeof alignContent[number]

const direction = tuple('row', 'row-reverse', 'column', 'column-reverse')

export type SectionDirection = typeof direction[number]

const wrap = tuple('nowrap', 'wrap', 'wrap-reverse')

export type SectionWrap = typeof wrap[number]
