import { SearchOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'
import { Option } from 'antd/es/mentions'
import React from 'react'

const InvitationSearchFilter = ({searchEmail, setSearchEmail, setFilterStatus}) => {
  return (
    <>
    <Input
        prefix={<SearchOutlined />}
        style={{width: "30vw", marginBottom: 10, float: "left" }}
        placeholder="Search by email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
      />

      <Select
        placeholder="Filter by status"
        style={{ width: "10vw", float: "left" ,marginLeft: "5%", marginBottom: "2%"}}
        allowClear
        onChange={(value) => setFilterStatus(value)}
      >
        <Option value="all">All</Option>
        <Option value="pending">Pending</Option>
        <Option value="accepted">Accepted</Option>
        <Option value="declined">Declined</Option>
        <Option value="expired">Expired</Option>
      </Select>
    </>
  )
}

export default InvitationSearchFilter