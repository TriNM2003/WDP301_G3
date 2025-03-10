import { Breadcrumb } from 'antd'
import React from 'react'
const breadCrumbItems = [
    {
      title: <a href="/Home">Home</a>
    },
    {
      title: <a href="/site">Site</a>
    },
    {
      title: <a href="/site/project">Project</a>
    },
    {
      title: "Manage project members"
    }
  ]

const ManageProjectMemberBreadcrump = () => {
  return (
    <Breadcrumb style={{ marginBottom: "20px" }} items={breadCrumbItems} />
  )
}

export default ManageProjectMemberBreadcrump