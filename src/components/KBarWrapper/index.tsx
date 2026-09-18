import { KBarProvider } from 'kbar'
import dynamic from 'next/dynamic'
import React from 'react'
import useKbarActions from 'src/utils/kbar-actions'

type KbarWrapperProps = {
  children?: React.ReactNode
}

const KBarComponent = dynamic(() => import('../KBar'), {
  ssr: false
})

// kbar 0.1.0-beta.6 types its components without `children`
const Provider = KBarProvider as React.FC<
  React.PropsWithChildren<React.ComponentProps<typeof KBarProvider>>
>

const KBarWrapper: React.FC<KbarWrapperProps> = ({ children }) => {
  const kbarActions = useKbarActions()

  return (
    <Provider
      actions={kbarActions}
      options={{
        animations: {
          enterMs: 250,
          exitMs: 100
        }
      }}
    >
      <KBarComponent />
      {children}
    </Provider>
  )
}

export default KBarWrapper
