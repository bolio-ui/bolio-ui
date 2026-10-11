import { useEffect } from 'react'

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    if (title.trim().length > 0) document.title = title.trim()
  }, [title])
}

export default useDocumentTitle
