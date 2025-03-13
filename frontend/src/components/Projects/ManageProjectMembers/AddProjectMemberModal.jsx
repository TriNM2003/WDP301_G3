import { gray, green } from '@ant-design/colors'
import { Avatar, Button, Modal, Select, Tag } from 'antd'
import Title from 'antd/es/skeleton/Title'
import React, { useState } from 'react'

const AddProjectMemberModal = ({addMemberModalVisible, setAddMemberModalVisible, handleAddMember, selectedEmail, setSelectedEmail, userEmails, selectMemberRole, setSelectedMemberRole, projectRoles}) => {
  const [searchValue, setSearchValue] = useState(""); // Giá trị input tìm kiếm
  const [filteredOptions, setFilteredOptions] = useState([]); // Danh sách email lọc
  const handleSearch = (input) => {
    setSearchValue(input);

    if (input.length < 2) {
      setFilteredOptions([]); // Không hiển thị gì nếu nhập dưới 2 ký tự
    } else {
      const filtered = userEmails.filter(user =>
        user.label.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };

  return (
    <Modal
        title="Add member"
        visible={addMemberModalVisible}
        onCancel={() => setAddMemberModalVisible(false)}
        footer={[
          <Button key="add" color={green[6]} variant="solid" onClick={() => handleAddMember()}>
            Add
          </Button>,
          <Button key="cancel" color="danger" variant="solid" onClick={() => setAddMemberModalVisible(false)} danger>
            Cancel
          </Button>,
        ]}
      >
        <Title level={5}>User email addresses</Title>
        <Select
      showSearch
      style={{ width: "100%" }}
      placeholder="Enter email address"
      value={selectedEmail}
      onChange={setSelectedEmail}
      onSearch={handleSearch} // Gọi khi nhập vào ô tìm kiếm
      options={filteredOptions} // Chỉ hiển thị danh sách đã lọc
      filterOption={false} // Không dùng filter mặc định, sử dụng handleSearch
      notFoundContent={searchValue.length < 2 ? "Input at least 2 character" : "No email found"} // Hiển thị khi không có dữ liệu
      optionRender={(item) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={item.data?.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
            style={{ marginRight: 8 }}
          />
          {item.label}
        </div>
      )}
    />
        <Title level={5} style={{marginTop: '2%'}}>Project role</Title>
        <Select
          style={{ width: "100%", marginBottom: "5%" }}
          placeholder="Choose project role"
          value={selectMemberRole}
          onChange={setSelectedMemberRole}
          options={projectRoles.filter(role => role.value !== "projectManager") || []}
        />

      </Modal>
  )
}

export default AddProjectMemberModal