import React from 'react'

const LoadingNavigation: React.FC<unknown> = () => {
  return (
    <div className="loading-navigation">
      <style jsx>{`
        .loading-navigation {
          height: 60px;
          position: relative;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default LoadingNavigation
