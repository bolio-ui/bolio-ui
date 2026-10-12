import { useEffect, useRef } from 'react'

const useLogger = (componentName: string, props: unknown[]) => {
  const mounted = useRef(false)
  const latest = useRef(props)
  latest.current = props

  useEffect(() => {
    console.log(`${componentName} mounted`, ...latest.current)
    return () => {
      console.log(`${componentName} unmounted`)
    }
  }, [componentName])

  useEffect(() => {
    if (mounted.current) {
      console.log(`${componentName} updated`, ...props)
    }
    mounted.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, props)
}

export default useLogger
