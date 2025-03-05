import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'

function ProjectListLayout() {
  return (
    <Layout style={{ minHeight: "100%", background:"white" }}><Outlet /></Layout>
  )
}

export default ProjectListLayout