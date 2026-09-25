import React from 'react'

export interface MenuConfig {
  // closes every level; `returnFocus` moves the focus back to the trigger
  close: (returnFocus: boolean) => void
}

export interface MenuListConfig {
  // id of the submenu open in this level, only one at a time
  openSub: string | null
  setOpenSub: (id: string | null) => void
}

export interface MenuRadioConfig {
  value?: string
  onChange?: (value: string) => void
}

export const MenuContext = React.createContext<MenuConfig>({
  close: () => undefined
})

export const MenuListContext = React.createContext<MenuListConfig>({
  openSub: null,
  setOpenSub: () => undefined
})

export const MenuRadioContext = React.createContext<MenuRadioConfig>({})
