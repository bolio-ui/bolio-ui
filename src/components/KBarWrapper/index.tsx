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

const KBarWrapper: React.FC<KbarWrapperProps> = ({ children }) => {
  const kbarActions = useKbarActions()

  return (
    <KBarProvider
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
    </KBarProvider>
  )
}

export default KBarWrapper
