import React, { MutableRefObject } from 'react'

export interface SelectConfig {
  value?: string | string[]
  updateValue?: (next: string) => unknown
  visible?: boolean
  updateVisible?: (next: boolean) => unknown
  disableAll?: boolean
  ref?: MutableRefObject<HTMLElement | null>
  // the option the keyboard is on, and what ties options to the listbox
  activeValue?: string
  listId?: string
  multiple?: boolean
}

export const getOptionId = (listId: string | undefined, value: string) =>
  `${listId}-${encodeURIComponent(value)}`

const defaultContext = {
  visible: false,
  disableAll: false
}

export const SelectContext = React.createContext<SelectConfig>(defaultContext)

export const useSelectContext = (): SelectConfig =>
  React.useContext<SelectConfig>(SelectContext)
