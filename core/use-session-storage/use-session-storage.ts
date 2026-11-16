import { createStorageHook } from '../use-local-storage/use-local-storage'

const useSessionStorage = createStorageHook(
  'sessionStorage',
  'bolio-ui-session-storage'
)

export default useSessionStorage
