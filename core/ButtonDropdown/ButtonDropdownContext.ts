import React from 'react'
import { NormalTypes } from '../utils/prop-types'

export type ButtonDropdownAlign = 'start' | 'center' | 'end'

export interface ButtonDropdownConfig {
  type?: NormalTypes
  auto?: boolean
  disabled?: boolean
  loading?: boolean
  align?: ButtonDropdownAlign
  close?: () => void
}

const defaultContext = {
  type: 'default' as NormalTypes,
  auto: false,
  disabled: false,
  loading: false,
  align: 'center' as ButtonDropdownAlign
}

export const ButtonDropdownContext =
  React.createContext<ButtonDropdownConfig>(defaultContext)

export const useButtonDropdown = (): ButtonDropdownConfig =>
  React.useContext<ButtonDropdownConfig>(ButtonDropdownContext)
