import { SearchOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'

const SearchInviteOption = ({searchTerm, setSearchTerm, setInviteModalVisible}) => {
  return (
    <div style={{ display: "flex", justifyContent:"start", flexWrap: "wrap"}}>
          <div style={{width: "100%"}}>
            <Title level={2} style={{marginTop: 0, marginBottom: "2%"}}>Site members</Title>
          </div>

          <Input
            prefix={<SearchOutlined />}
            placeholder="Search member"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setInviteModalVisible(true)} style={{marginLeft: "2%"}}>
          Invite
        </Button>

    </div>
  )
}

export default SearchInviteOption