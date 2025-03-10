import { green } from '@ant-design/colors'
import { Avatar, Button, Modal, Select, Spin } from 'antd'
import Title from 'antd/es/skeleton/Title'
import React, { useState } from 'react'

const InviteMemberModal = ({inviteModalVisible, setInviteModalVisible, handleInviteMember, selectedEmail, setSelectedEmail, userEmails}) => {
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
      title="Invite member"
      visible={inviteModalVisible}
      onCancel={() => setInviteModalVisible(false)}
      footer={[
        <Button key="add" style={{ backgroundColor: green[6], color: "#fff" }} onClick={handleInviteMember}>
          Invite
        </Button>,
        <Button key="cancel" danger onClick={() => setInviteModalVisible(false)}>
          Cancel
        </Button>,
      ]}
    >
      <Title level={5}>User email addresses</Title>
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

export default InviteMemberModal