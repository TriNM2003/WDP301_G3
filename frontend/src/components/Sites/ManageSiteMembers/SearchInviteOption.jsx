import { SearchOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React from 'react'

const SearchInviteOption = ({searchTerm, setSearchTerm, setInviteModalVisible}) => {
  return (
    <div style={{ display: "flex", marginBottom: "20px"}}>
        <div style={{ display: "flex", gap: "10px",  marginRight: "20px" }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search member"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        </div>

        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setInviteModalVisible(true)}>
          Invite
        </Button>

    </div>
  )
}

export default SearchInviteOption