import { useEffect, useState } from 'react'

export type UseOsResult =
  | 'undetermined'
  | 'macos'
  | 'ios'
  | 'windows'
  | 'android'
  | 'linux'
  | 'chromeos'

const detect = (): UseOsResult => {
  const ua = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (ua.includes('macintosh') && navigator.maxTouchPoints > 1) return 'ios'
  if (ua.includes('android')) return 'android'
  if (/windows|win32/.test(ua)) return 'windows'
  if (ua.includes('cros')) return 'chromeos'
  if (/macintosh|mac os x/.test(ua)) return 'macos'
  if (ua.includes('linux')) return 'linux'
  return 'undetermined'
}

const useOs = (): UseOsResult => {
  const [os, setOs] = useState<UseOsResult>('undetermined')

  useEffect(() => setOs(detect()), [])

  return os
}

export default useOs
