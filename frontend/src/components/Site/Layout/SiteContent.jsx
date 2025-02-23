import React from 'react'
import { Outlet } from 'react-router-dom'

function SiteContent() {
  return (
    <div style={{
      overflowY: 'scroll',
      overflowX: 'unset',
      height: '100%',
      border: "0",
      
    }}>
      <Outlet/>
    </div>
  )
}

export default SiteContent
