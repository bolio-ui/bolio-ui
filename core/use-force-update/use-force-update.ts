import { useReducer } from 'react'

const useForceUpdate = () => {
  const [, forceUpdate] = useReducer((tick: number) => tick + 1, 0)
  return forceUpdate
}

export default useForceUpdate
