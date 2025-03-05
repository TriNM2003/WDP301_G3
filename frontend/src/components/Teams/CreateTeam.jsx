import React, { useState } from "react";
import { Modal, Form, Input, Button, List, Avatar, Tag, Select } from "antd";

const { Option } = Select;

const mockUsers = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: "4", name: "David White", email: "david@example.com", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: "5", name: "Emily Green", email: "emily@example.com", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
];

const CreateTeam = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamLeader, setTeamLeader] = useState(null);

  // Lọc user theo search term
  const filteredUsers = searchTerm
    ? mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Chọn Team Leader
  const handleSelectLeader = (leaderId) => {
    const leader = mockUsers.find(user => user.id === leaderId);
    setTeamLeader(leader);
  };

  // Thêm thành viên vào danh sách team
  const handleSelectMember = (user) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchTerm(""); // Reset input sau khi chọn
  };

  // Xóa thành viên khỏi danh sách
  const handleRemoveMember = (id) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== id));
  };

  return (
    <Modal
      open={visible}
      title="Create New Team"
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={(values) => onCreate({ ...values, teamLeader, teamMembers: selectedUsers })}>
        
        {/* Team Name */}
        <Form.Item
          name="teamName"
          label="Team Name"
          rules={[{ required: true, message: "Please enter a team name!" }]}
        >
          <Input placeholder="Enter team name" />
        </Form.Item>


        {/* Invite Team Members */}
        <Form.Item label="Add Team Members">
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
                  onClick={() => handleSelectMember(user)}
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
                onClose={() => handleRemoveMember(user.id)}
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

export default CreateTeam;
