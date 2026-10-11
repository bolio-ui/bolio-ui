import { useCallback, useEffect, useState } from 'react'

type EyeDropperApi = new () => {
  open: (options?: { signal?: AbortSignal }) => Promise<{ sRGBHex: string }>
}

const useEyeDropper = () => {
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported('EyeDropper' in window)
  }, [])

  const open = useCallback(
    async (options?: { signal?: AbortSignal }) => {
      if (!supported) return undefined
      const Api = (window as unknown as { EyeDropper: EyeDropperApi })
        .EyeDropper
      return new Api().open(options)
    },
    [supported]
  )

  return { supported, open }
}

export default useEyeDropper
