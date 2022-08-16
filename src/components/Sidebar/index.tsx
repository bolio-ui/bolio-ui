import React from 'react'
import { Button, useTheme } from 'core'

const Sidebar: React.FC = () => {
  const theme = useTheme()

  return (
    <div className="sides box">
      {/* <SideItem sides={tabbarData}>
        <SideGroup />
      </SideItem> */}
      <Button>Sidebar</Button>
      <Button>Sidebar</Button>
      <Button>Sidebar</Button>
      <Button>Sidebar</Button>
      <Button>Sidebar</Button>
      <Button>Sidebar</Button>
      <Button>Sidebar</Button>
      <style jsx>{`
        .sides {
          width: 100%;
          padding-bottom: ${theme.layout.gap};
        }
        .box {
          overflow-y: auto;
          overflow-x: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .box::-webkit-scrollbar {
          width: 0;
          background-color: transparent;
        }
        .box > :global(.item) {
          margin-bottom: ${theme.layout.gap};
        }
      `}</style>
    </div>
  )
}

export default Sidebar
