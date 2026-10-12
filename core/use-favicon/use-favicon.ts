import { useEffect } from 'react'

const useFavicon = (url: string) => {
  useEffect(() => {
    if (!url) return
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
    if (!link) {
      link = document.createElement('link')
      link.rel = 'shortcut icon'
      document.head.appendChild(link)
    }
    link.href = url
  }, [url])
}

export default useFavicon
