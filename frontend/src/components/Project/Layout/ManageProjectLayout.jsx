import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'
import ManageProjectMemberSider from "../ManageProjectMemberSider";

const ManageProjectLayout = () => {
  return (
    <Layout>
        <ManageProjectMemberSider />
        <Outlet />
    </Layout>
  )
}

export default ManageProjectLayout