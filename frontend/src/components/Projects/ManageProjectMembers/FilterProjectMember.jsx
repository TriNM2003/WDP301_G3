import { Select } from 'antd'
import { Option } from 'antd/es/mentions'
import React from 'react'

const FilterProjectMember = ({project, setSelectedRole, formatRole}) => {
  return (
    <div style={{ display: "flex", marginBottom: "20px" }}>
        <p>Filter</p>
      <Select
            placeholder="All"
            allowClear
            style={{ width: 150, marginLeft: "20px",  alignItems: "center", marginTop: "8px", marginBottom: "10px" }}
            onChange={(value) => setSelectedRole(value)}
          >
            <Option value="All">All</Option>
            {project?.projectRoles?.map((role, index) => {
              return <Option key={index+1} value={role}>{formatRole(role)}</Option>
            })}
          </Select>
      </div>
  )
}

export default FilterProjectMember