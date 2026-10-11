import { useEffect, useState } from 'react'

export type UseOrientationResult = {
  angle: number
  type: OrientationType
}

const useOrientation = (
  defaultValue: UseOrientationResult = { angle: 0, type: 'landscape-primary' }
): UseOrientationResult => {
  const [orientation, setOrientation] = useState(defaultValue)

  useEffect(() => {
    const screenOrientation = window.screen?.orientation
    if (!screenOrientation) return
    const update = () =>
      setOrientation({
        angle: screenOrientation.angle,
        type: screenOrientation.type
      })
    update()
    screenOrientation.addEventListener('change', update)
    return () => screenOrientation.removeEventListener('change', update)
  }, [])

  return orientation
}

export default useOrientation
