import { useEffect, useState } from 'react'

// The preferred language of the browser, such as "pt-BR". It is undefined on
// the server and on the first render, then follows the browser.
const useBrowserLanguage = (): string | undefined => {
  const [language, setLanguage] = useState<string | undefined>()

  useEffect(() => {
    const update = () => setLanguage(navigator.language)
    update()
    window.addEventListener('languagechange', update)
    return () => window.removeEventListener('languagechange', update)
  }, [])

  return language
}

export default useBrowserLanguage
