import React from 'react'
import { LiveEditor } from 'react-live'
import { useTheme } from 'core'

const Editor: React.FC = () => {
  const theme = useTheme()

  return (
    <div className="live-editor-container">
      <header>
        <div className="traffic">
          <span className="close" />
          <span className="mini" />
          <span className="full" />
        </div>
      </header>
      <div className="area">
        <LiveEditor />
      </div>
      <style jsx>{`
        .live-editor-container {
          width: 100%;
        }
        .area {
          height: 350px;
          overflow: auto;
          border-bottom-left-radius: ${theme.layout.radius};
          border-bottom-right-radius: ${theme.layout.radius};
        }
        .browser {
          width: 100%;
          background-color: transparent;
          box-shadow: ${theme.expressiveness.shadowLarge};
          max-width: 100%;
          border-radius: ${theme.layout.radius};
          overflow: hidden;
          height: 400px;
        }
        header {
          height: 2.5em;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background-color: ${theme.palette.accents_1};
          border-top-left-radius: ${theme.layout.radius};
          border-top-right-radius: ${theme.layout.radius};
        }
        .traffic {
          width: auto;
          position: absolute;
          left: ${theme.layout.gapHalf};
          top: 50%;
          transform: translateY(-50%);
          bottom: 0;
          height: 100%;
          display: flex;
          align-items: center;
          user-select: none;
          font-size: inherit;
        }
        .traffic span {
          border-radius: 50%;
          width: 0.75em;
          height: 0.75em;
          max-width: 20px;
          max-height: 20px;
          display: inline-block;
          margin-right: 0.5em;
        }
        .close {
          background-color: #ff5f56;
        }
        .mini {
          background-color: #ffbd2e;
        }
        .full {
          background-color: #27c93f;
        }
      `}</style>
    </div>
  )
}

export default Editor
