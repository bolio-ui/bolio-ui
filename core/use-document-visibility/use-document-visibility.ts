import { useEffect, useState } from 'react'

const useDocumentVisibility = (): DocumentVisibilityState => {
  const [visibility, setVisibility] =
    useState<DocumentVisibilityState>('visible')

  useEffect(() => {
    const update = () => setVisibility(document.visibilityState)
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  return visibility
}

export default useDocumentVisibility
