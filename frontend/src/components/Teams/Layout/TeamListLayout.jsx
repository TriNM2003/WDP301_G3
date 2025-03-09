import { Layout } from 'antd'
import React from 'react'
import { Outlet } from 'react-router-dom'

function TeamListLayout() {
  return (
    <Layout style={{ minHeight: "100%", background:"white" }}><Outlet /></Layout>
  )
}

export default TeamListLayout