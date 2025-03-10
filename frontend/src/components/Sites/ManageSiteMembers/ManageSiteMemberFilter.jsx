import { Select } from 'antd';
import { Option } from 'antd/es/mentions';
import React from 'react'

const ManageSiteMemberFilter = ({site, formatRole, setSelectedFilterRole}) => {
  return (
    <div style={{ display: "flex", marginBottom: "20px" }}>
        <p>Filter</p>
      <Select
            placeholder="All"
            allowClear
            style={{ width: 150, marginLeft: "20px",  alignItems: "center", marginTop: "8px", marginBottom: "10px" }}
            onChange={(value) => setSelectedFilterRole(value)}
          >
            <Option value="All">All</Option>
            {site?.siteRoles?.map(role => {
              const formattedRole = formatRole(role);
              return <Option value={role}>{formattedRole}</Option>
            }) || <Option value="not found">not found</Option>}
          </Select>
      </div>
  )
}

export default ManageSiteMemberFilter