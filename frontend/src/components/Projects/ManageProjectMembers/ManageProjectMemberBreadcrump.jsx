import { Breadcrumb } from 'antd'
import React from 'react'


const ManageProjectMemberBreadcrump = ({project}) => {
  const breadCrumbItems = [
    {
      title: <a href="/Home">Home</a>
    },
    {
      title: <a href="/site">Site</a>
    },
    {
      title: <a href="/site/list/projects">Projects</a>
    },
    {
      title: <a href={"/site/list/projects/" + (project.projectSlug || "")}>{project.projectName || "Not found"}</a>
    },
    {
      title: "Manage project members"
    }
  ]
  return (
    <Breadcrumb style={{ marginBottom: "20px" }} items={breadCrumbItems} />
  )
}

export default ManageProjectMemberBreadcrump