import { useEffect, useState } from 'react'

const useTextSelection = (): Selection | null => {
  const [selection, setSelection] = useState<Selection | null>(null)

  useEffect(() => {
    const update = () => setSelection(document.getSelection())
    update()
    document.addEventListener('selectionchange', update)
    return () => document.removeEventListener('selectionchange', update)
  }, [])

  return selection
}

export default useTextSelection
