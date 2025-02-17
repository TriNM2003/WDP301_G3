import React from 'react'
import SiteNav from '../../Project/Common/ProjectNav'
import { Outlet } from 'react-router-dom'

function SiteContent() {
  return (
    <div style={{
      overflow: 'auto',
      height: '100%',
      border: "0",
      
    }}>
      <Outlet/>
    </div>
  )
}

export default SiteContent
