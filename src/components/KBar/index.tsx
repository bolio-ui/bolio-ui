import React from 'react'
import { useTheme } from 'core'
import Backdrop from 'core/Shared/backdrop'
import {
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  VisualState,
  useKBar
} from 'kbar'
import KBarOption from './option'
import KBarSearch from './search'
import KBarResults from './results'
import generateStyles from './styles'
import { Action, ResultHandlers, ResultState } from './types'

const KBar: React.FC<unknown> = () => {
  const theme = useTheme()
  const styles = generateStyles(theme)
  const { visible } = useKBar((state) => ({
    visible: state.visualState !== VisualState.hidden
  }))

  return (
    <KBarPortal>
      <Backdrop className="backdrop" visible={visible}>
        <KBarPositioner>
          <KBarAnimator style={styles.container}>
            <KBarSearch placeholder="What do you need?" />
            <KBarResults
              style={styles.result}
              onRender={(
                action: Action,
                handlers: ResultHandlers,
                state: ResultState
              ) => (
                <KBarOption action={action} handlers={handlers} state={state} />
              )}
            />
          </KBarAnimator>
        </KBarPositioner>
      </Backdrop>
      <style jsx>
        {`
          :global(.backdrop .content) {
            height: 100%;
          }
        `}
      </style>
    </KBarPortal>
  )
}

export default KBar
