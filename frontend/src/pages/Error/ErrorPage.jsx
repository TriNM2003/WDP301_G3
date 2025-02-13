import React from 'react'
import E404 from '../../components/Error/E404'
import { Outlet } from 'react-router-dom'

function ErrorPage() {
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default ErrorPage
