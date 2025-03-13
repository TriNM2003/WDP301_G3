import { green } from '@ant-design/colors'
import { Avatar, Button, Input, Modal, Select, Spin } from 'antd'
import Title from 'antd/es/typography/Title';
import React, { useState } from 'react'

const CreateProjectModal = ({createProjectModalVisible, setCreateProjectModalVisible, handleCreateProject,selectedProjectName, setSelectedProjectName, selectedEmail, setSelectedEmail, userEmails}) => {
    const [searchValue, setSearchValue] = useState(""); // Giá trị ô tìm kiếm
      const [filteredOptions, setFilteredOptions] = useState([]); // Lưu options hiển thị
    
      const handleSearch = (input) => {
        setSearchValue(input);
    
        if (input.length < 2) {
          setFilteredOptions([]); // Không hiển thị gì nếu nhập dưới 2 ký tự
        } else {
          // Lọc danh sách userEmails dựa trên input
          const filtered = userEmails.filter(user =>
            user.label.toLowerCase().includes(input.toLowerCase())
          );
          setFilteredOptions(filtered);
        }
      };


  return (
    <Modal
      title="Create project"
      visible={createProjectModalVisible}
      onCancel={() => setCreateProjectModalVisible(false)}
      footer={[
        <Button key="add" style={{ backgroundColor: green[6], color: "#fff" }} onClick={handleCreateProject}>
          Invite
        </Button>,
        <Button key="cancel" danger onClick={() => setCreateProjectModalVisible(false)}>
          Cancel
        </Button>,
      ]}
    >
        <Title level={5}>Project name</Title>
        <Input value={selectedProjectName} onChange={(e) => setSelectedProjectName(e.target.value)} placeholder='Enter project name'/>

      <Title level={5}>Assign project manager</Title>
      <Select
      showSearch
      style={{ width: "100%" }}
      placeholder="Select user email"
      value={selectedEmail}
      onChange={setSelectedEmail}
      onSearch={handleSearch} // Gọi khi nhập vào ô tìm kiếm
      notFoundContent={searchValue.length < 2 ? "Enter at least 2 character" : "No email found"} // Hiển thị khi không có dữ liệu
      options={filteredOptions} // Chỉ hiển thị khi nhập trên 2 ký tự
      filterOption={false} // Không lọc tự động, dùng `handleSearch`
      optionRender={(item) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={item.data.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
            style={{ marginRight: 8 }}
          />
          {item.label}
        </div>
      )}
    />
    </Modal>
  )
}

export default CreateProjectModal