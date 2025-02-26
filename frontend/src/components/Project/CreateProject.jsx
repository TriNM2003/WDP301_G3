import React, { useState } from "react";
import { Modal, Form, Input, Button, Space, List, Avatar, Checkbox, Tag } from "antd";

const mockUsers = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: "4", name: "David White", email: "david@example.com", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: "5", name: "Emily Green", email: "emily@example.com", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
];

const CreateProject = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Lọc user theo search term
  const filteredUsers = searchTerm
    ? mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Thêm user vào danh sách đã chọn
  const handleSelectUser = (user) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm(""); // Reset input sau khi chọn
  };

  // Xóa user khỏi danh sách đã chọn
  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== id));
  };

  return (
    <Modal
      open={visible}
      title="Create New Project"
      onCancel={onCancel}
      footer={null} 
    >
      <Form form={form} layout="vertical" onFinish={onCreate}>
        {/* Project Name */}
        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[{ required: true, message: "Please enter a project name!" }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        {/* Invite Project Members */}
        <Form.Item label="Invite Project Members">
          <Input
            placeholder="Search by username or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "8px" }}
          />
          
          {/* Hiển thị danh sách gợi ý user */}
          {filteredUsers.length > 0 && (
            <List
              bordered
              size="small"
              dataSource={filteredUsers}
              renderItem={(user) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar src={user.avatar} size="small" style={{ marginRight: 8 }} />
                  {user.name} ({user.email})
                </List.Item>
              )}
            />
          )}

          {/* Hiển thị danh sách user đã chọn */}
          <div style={{ marginTop: "10px" }}>
            {selectedUsers.map(user => (
              <Tag
                key={user.id}
                closable
                onClose={() => handleRemoveUser(user.id)}
                style={{ display: "inline-flex", alignItems: "center", marginBottom: "5px" }}
              >
                <Avatar src={user.avatar} size="small" style={{ marginRight: 5 }} />
                {user.name}
              </Tag>
            ))}
          </div>
        </Form.Item>

        {/* Footer Buttons */}
        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
          <Button key="cancel" onClick={onCancel} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button key="create" type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProject;
