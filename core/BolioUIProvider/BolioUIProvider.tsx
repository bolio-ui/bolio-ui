import React, { PropsWithChildren, useMemo, useState } from 'react'
import {
  BolioUIContent,
  defaultToastLayout,
  BolioUIContextParams,
  UpdateToastsFunction,
  UpdateToastsIDFunction,
  UpdateToastsLayoutFunction
} from '../utils/use-bolio-ui-context'
import ThemeProvider from './ThemeProvider'
import useCurrentState from '../utils/use-current-state'
import ToastContainer from '../use-toasts/toast-container'
import { BolioUIThemes } from '../Themes/Presets'

export type BolioUIProviderProps = {
  themes?: Array<BolioUIThemes>
  themeType?: string | 'dark' | 'light'
}

const BolioUIProvider: React.FC<PropsWithChildren<BolioUIProviderProps>> = ({
  themes,
  themeType,
  children
}) => {
  const [lastUpdateToastId, setLastUpdateToastId] =
    useState<BolioUIContextParams['lastUpdateToastId']>(null)
  const [toasts, setToasts, toastsRef] = useCurrentState<
    BolioUIContextParams['toasts']
  >([])
  const [toastLayout, setToastLayout, toastLayoutRef] =
    useCurrentState<BolioUIContextParams['toastLayout']>(defaultToastLayout)
  const updateToasts: UpdateToastsFunction = (fn) => {
    const nextToasts = fn(toastsRef.current)
    setToasts(nextToasts)
  }
  const updateToastLayout: UpdateToastsLayoutFunction = (fn) => {
    const nextLayout = fn(toastLayoutRef.current)
    setToastLayout(nextLayout)
  }
  const updateLastToastId: UpdateToastsIDFunction = (fn) => {
    setLastUpdateToastId(fn())
  }

  const initialValue = useMemo<BolioUIContextParams>(
    () => ({
      toasts,
      toastLayout,
      updateToasts,
      lastUpdateToastId,
      updateToastLayout,
      updateLastToastId
    }),
    [toasts, toastLayout, lastUpdateToastId]
  )

  return (
    <BolioUIContent.Provider value={initialValue}>
      <ThemeProvider themes={themes} themeType={themeType}>
        {children}
        <ToastContainer />
      </ThemeProvider>
    </BolioUIContent.Provider>
  )
}

export default BolioUIProvider
