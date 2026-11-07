import { isMac } from '../utils/collections'
import { KeyMod } from './codes'

/* istanbul ignore next */
export const getCtrlKeysByPlatform = (): Record<
  string,
  'metaKey' | 'ctrlKey'
> => {
  return {
    CtrlCmd: isMac() ? 'metaKey' : 'ctrlKey',
    WinCtrl: isMac() ? 'ctrlKey' : 'metaKey'
  }
}

export const getActiveModMap = (
  bindings: number[]
): Record<keyof typeof KeyMod, boolean> => ({
  CtrlCmd: bindings.includes(KeyMod.CtrlCmd),
  Shift: bindings.includes(KeyMod.Shift),
  Alt: bindings.includes(KeyMod.Alt),
  WinCtrl: bindings.includes(KeyMod.WinCtrl)
})
