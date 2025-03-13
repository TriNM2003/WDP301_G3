import { green } from '@ant-design/colors'
import { SearchOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'

const SearchAddProjectMember = ({searchTerm, setSearchTerm, setAddMemberModalVisible}) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "start", gap: "2%", marginBottom: "20px"}}>
      <div style={{width: "100%"}}>
            <Title level={2} style={{marginTop: 0, marginBottom: "2%"}}>Project members</Title>
        </div>
          {/* search bar */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search member"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />

        {/* add member button */}
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAddMemberModalVisible(true)}>
          Add
        </Button>
      </div>
  )
}

export default SearchAddProjectMember