import { Breadcrumb } from 'antd'
import React from 'react'
const breadCrumbItems = [
    {
      title: <a href="/home">Home</a>
    },
    {
      title: <a href="/site">Site</a>
    },
    {
      title: "Manage projects"
    }
  ]


const ManageProjectsBreadcrump = () => {
  return (
    <Breadcrumb style={{ marginBottom: "20px" }} items={breadCrumbItems} />
  )
}

export default ManageProjectsBreadcrump