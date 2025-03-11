import { SearchOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'

const ProjectsSearchbar = ({setCreateProjectModal, searchTerm, setSearchTerm}) => {
  return (
    <>
    <div style={{ display: "flex", gap: "10px",  marginRight: "20px", justifyContent: "space-between" }}>
          <Title level={2}>Projects</Title>
          <Button type="primary" style={{marginTop: "35px"}} onClick={() => setCreateProjectModal(true)}>Create project</Button>
      </div>

      <div style={{ display: "flex", marginBottom: "20px"}}>
        <div style={{ display: "flex", gap: "10px",  marginRight: "20px" }}>
          {/* search bar */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        </div>
      </div>
    </>
  )
}

export default ProjectsSearchbar