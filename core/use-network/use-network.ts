import { useEffect, useState } from 'react'

export type UseNetworkResult = {
  online?: boolean
  downlink?: number
  downlinkMax?: number
  effectiveType?: string
  rtt?: number
  saveData?: boolean
  type?: string
}

type NetworkInformation = EventTarget & Omit<UseNetworkResult, 'online'>

const read = (): UseNetworkResult => {
  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection
  return {
    online: navigator.onLine,
    downlink: connection?.downlink,
    downlinkMax: connection?.downlinkMax,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    type: connection?.type
  }
}

const useNetwork = (): UseNetworkResult => {
  const [status, setStatus] = useState<UseNetworkResult>({})

  useEffect(() => {
    const update = () => setStatus(read())
    const connection = (
      navigator as Navigator & { connection?: NetworkInformation }
    ).connection
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    connection?.addEventListener('change', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
      connection?.removeEventListener('change', update)
    }
  }, [])

  return status
}

export default useNetwork
