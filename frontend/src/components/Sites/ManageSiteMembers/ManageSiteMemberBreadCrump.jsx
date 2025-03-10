import { Breadcrumb } from 'antd'
import React from 'react'

const ManageSiteMemberBreadCrump = () => {
    const breadCrumbItems = [
        {
          title: <a href="/home">Home</a>
        },
        {
          title: <a href="/site">Site</a>
        },
        {
          title: "Manage site members"
        }
      ]

  return (
    <Breadcrumb style={{ marginBottom: "20px" }} items={breadCrumbItems} />
  )
}

export default ManageSiteMemberBreadCrump