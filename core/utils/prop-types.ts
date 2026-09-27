export const tuple = <T extends string[]>(...args: T) => args

export const tupleNumber = <T extends number[]>(...args: T) => args

export type ButtonTypes =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'abort'
  | 'primary-light'
  | 'secondary-light'
  | 'info-light'
  | 'success-light'
  | 'warning-light'
  | 'error-light'

export type NormalTypes =
  'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'

export type SnippetTypes =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'dark'
  | 'lite'

export type CardTypes =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'dark'
  | 'lite'
  | 'info'

export type CopyTypes = 'default' | 'silent' | 'prevent'

export type TriggerTypes = 'hover' | 'click'

export type Placement =
  | 'top'
  | 'topStart'
  | 'topEnd'
  | 'left'
  | 'leftStart'
  | 'leftEnd'
  | 'bottom'
  | 'bottomStart'
  | 'bottomEnd'
  | 'right'
  | 'rightStart'
  | 'rightEnd'

export type DividerAlign = 'start' | 'center' | 'end' | 'left' | 'right'
