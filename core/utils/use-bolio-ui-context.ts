import React from 'react'
import type { ToastLayout, Toast } from '../use-toasts/use-toast'

export const defaultToastLayout: Required<ToastLayout> = {
  padding: '12px 16px',
  margin: '8px 0',
  width: '420px',
  maxWidth: '90vw',
  maxHeight: '75px',
  placement: 'bottomRight'
}

export type UpdateToastsFunction = (
  fn: (toasts: Array<Toast>) => Array<Toast>
) => any
export type UpdateToastsLayoutFunction = (
  fn: (layout: Required<ToastLayout>) => Required<ToastLayout>
) => any
export type UpdateToastsIDFunction = (fn: () => string | null) => any

export interface BolioUIContextParams {
  toasts: Array<Toast>
  updateToasts: UpdateToastsFunction
  toastLayout: Required<ToastLayout>
  updateToastLayout: UpdateToastsLayoutFunction
  lastUpdateToastId: string | null
  updateLastToastId: UpdateToastsIDFunction
}

const defaultParams: BolioUIContextParams = {
  toasts: [],
  toastLayout: defaultToastLayout,
  updateToastLayout: (t) => t,
  updateToasts: (t) => t,
  lastUpdateToastId: null,
  updateLastToastId: () => null
}

export const BolioUIContent: React.Context<BolioUIContextParams> =
  React.createContext<BolioUIContextParams>(defaultParams)

export const useBolioUIContext = (): BolioUIContextParams =>
  React.useContext<BolioUIContextParams>(BolioUIContent)
