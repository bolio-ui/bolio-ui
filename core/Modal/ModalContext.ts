import React from 'react'

export interface ModalConfig {
  close?: () => void
  titleId?: string
  descriptionId?: string
}

const defaultContext = {}

export const ModalContext = React.createContext<ModalConfig>(defaultContext)

export const useModalContext = (): ModalConfig =>
  React.useContext<ModalConfig>(ModalContext)
