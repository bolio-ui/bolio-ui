import React from 'react'
import Loading from '../loading'

interface Props {
  color: string
}

function ButtonLoading({ color }: Props) {
  return (
    <div className="btn-loading">
      <Loading color={color} />
      <style jsx>{`
        .btn-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          background-color: var(--bolio-ui-button-bg);
        }
      `}</style>
    </div>
  )
}

ButtonLoading.displayName = 'BolioUIButtonLoading'
export default ButtonLoading
