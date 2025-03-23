import { SearchOutlined } from '@ant-design/icons'
import { Input, Select } from 'antd'
import { Option } from 'antd/es/mentions'
import Title from 'antd/es/typography/Title'
import React from 'react'

const InvitationSearchFilter = ({searchEmail, setSearchEmail, setFilterStatus}) => {
  return (
    <div style={{display: "flex" , flexWrap: "wrap", justifyContent:"start"}}>
      <div style={{width: "100%", textAlign: "start"}}>
        <Title level={2} style={{ marginTop: 0, marginBottom: "2%"}}>Invitations</Title>
      </div>

    <Input
        prefix={<SearchOutlined />}
        style={{width: "30vw"}}
        placeholder="Search by email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
      />

      <Select
        placeholder="Filter by status"
        style={{ width: "10vw",marginLeft: "5%"}}
        allowClear
        onChange={(value) => setFilterStatus(value)}
      >
        <Option value="all">All</Option>
        <Option value="pending">Pending</Option>
        <Option value="accepted">Accepted</Option>
        <Option value="declined">Declined</Option>
        <Option value="expired">Expired</Option>
        <Option value="cancelled">Cancelled</Option>
      </Select>
      
    </div>
  )
}

export default InvitationSearchFilter