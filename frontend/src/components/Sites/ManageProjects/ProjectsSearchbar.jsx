import { SearchOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import Title from 'antd/es/typography/Title'
import React from 'react'

const ProjectsSearchbar = ({setCreateProjectModal, searchTerm, setSearchTerm}) => {
  return (
    <>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: "10px" }}>
          {/* search bar */}
          <div style={{width: "100%"}}>
            <Title level={2} style={{marginTop: 0, marginBottom: "2%"}}>Projects</Title>
          </div>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "20vw" }}
          />
          <Button type="primary" onClick={() => setCreateProjectModal(true)}>Create project</Button>
        </div>
    </>
  )
}

export default ProjectsSearchbar