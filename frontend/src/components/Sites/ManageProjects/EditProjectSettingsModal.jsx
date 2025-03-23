import { green } from '@ant-design/colors'
import { UploadOutlined } from '@ant-design/icons';
import { Avatar, Button, Image, Input, Modal, Select, Spin, Upload } from 'antd'
import Title from 'antd/es/typography/Title';
import React, { useState } from 'react'


const EditProjectSettingsModal = ({loading, editProjectModalVisisble, setEditProjectModalVisible, handleEditProject, currentProjectSettings, setCurrentProjectSettings, handleFileChange, imagePreview}) => {
  return (
    <Modal
      title="Edit project"
      width={400}
      open={editProjectModalVisisble}
      onCancel={() => setEditProjectModalVisible(false)}
      footer={[
        <div style={{display: "flex", justifyContent: "center", marginTop: "10%", gap:"5px"}}>
            <Button key="add" style={{ backgroundColor: green[6], color: "#fff"}} onClick={handleEditProject} loading={loading}>
          Save
        </Button>,
        <Button key="cancel" danger onClick={() => setEditProjectModalVisible(false)}>
          Cancel
        </Button>,
        </div>
        
      ]}
    >
        <div style={{textAlign: "center"}}>
            <Title level={5}><span ><div>Project avatar</div> <Image src={imagePreview || currentProjectSettings.projectAvatar || ""}  style={{width: "11vw", height: "20vh", textAlign:"center"}}/></span></Title>
            <Upload showUploadList={false} beforeUpload={() => false} onChange={handleFileChange}>
                <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
        </div>

        <div  style={{textAlign: "center"}}>
            <Title level={5}>Project name</Title>
            <Input style={{width: "50%"}} value={currentProjectSettings.projectName} onChange={(e) => setCurrentProjectSettings({...currentProjectSettings, projectName: e.target.value})} placeholder='Enter project name'/>
        </div>

        <div  style={{textAlign: "center"}}>
            <Title level={5}>Project slug</Title>
            <Input style={{width: "50%"}} value={currentProjectSettings.projectSlug} onChange={(e) => setCurrentProjectSettings({...currentProjectSettings, projectSlug: e.target.value})} placeholder='Enter project slug'/>
        </div>
      
    </Modal>
  )
}

export default EditProjectSettingsModal