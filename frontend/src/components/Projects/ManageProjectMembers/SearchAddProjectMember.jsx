import { SearchOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React from 'react'

const SearchAddProjectMember = ({searchTerm, setSearchTerm, setAddMemberModalVisible}) => {
  return (
    <div style={{ display: "flex", marginBottom: "20px"}}>
        <div style={{ display: "flex", gap: "10px",  marginRight: "20px" }}>
          {/* search bar */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search member"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        </div>

        {/* add member button */}
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAddMemberModalVisible(true)}>
          Add
        </Button>
      </div>
  )
}

export default SearchAddProjectMember