export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left'

export type DrawerTranslateItem = {
  initial: string
  hidden: string
  visible: string
}

export const getDrawerTransform = (
  placement: DrawerPlacement
): DrawerTranslateItem => {
  const translates: Record<DrawerPlacement, DrawerTranslateItem> = {
    top: {
      initial: 'translate3d(0, -100%, 0)',
      hidden: 'translate3d(0, -100%, 0)',
      visible: 'translate3d(0, 0, 0)'
    },
    left: {
      initial: 'translate3d(-100%, 0, 0)',
      hidden: 'translate3d(-100%, 0, 0)',
      visible: 'translate3d(0, 0, 0)'
    },
    bottom: {
      initial: 'translate3d(0, 100%, 0)',
      hidden: 'translate3d(0, 100%, 0)',
      visible: 'translate3d(0, 0, 0)'
    },
    right: {
      initial: 'translate3d(100%, 0, 0)',
      hidden: 'translate3d(100%, 0, 0)',
      visible: 'translate3d(0, 0, 0)'
    }
  }
  return translates[placement]
}
