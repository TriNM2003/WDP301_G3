import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'

const ManageProjectLayout = () => {
  return (
    <Layout>
        <Outlet />
    </Layout>
  )
}

export default ManageProjectLayout