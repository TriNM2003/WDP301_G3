import React, { useState } from "react";
import {
  Table,
  Button,
  Dropdown,
  Menu,
  Popconfirm,
  Select,
  Input,
  Space,
  Typography,
  Breadcrumb,
  Modal,
  Avatar,
  Radio,
} from "antd";
import {
  UserOutlined,
  DownOutlined,
  LockOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  UserAddOutlined,
  MailOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { gold, green } from "@ant-design/colors";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const MembersManagement = () => {
  const [members, setMembers] = useState([
    { key: "1", name: "John", email: "John@gmail.com", role: "Owner" },
    { key: "2", name: "Alice", email: "Alice@gmail.com", role: "Member" },
    { key: "3", name: "Bob", email: "Bob@gmail.com", role: "Admin" },
    { key: "4", name: "Bob", email: "Bob@gmail.com", role: "Admin" },
    { key: "5", name: "Bob", email: "Bob@gmail.com", role: "Admin" },
    { key: "6", name: "Bob", email: "Bob@gmail.com", role: "Admin" },
    { key: "7", name: "Bob", email: "Bob@gmail.com", role: "Admin" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Xử lý tìm kiếm
  let filteredMembers;
  if(selectedRole !== "All"){
    filteredMembers = members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (!selectedRole || member.role === selectedRole)
      );
  }else{
    filteredMembers = members
  }

  // Xử lý đổi vai trò
  const handleRoleChange = (key, newRole) => {
    setMembers(members.map((member) => (member.key === key ? { ...member, role: newRole } : member)));
  };

  // Xử lý xóa thành viên bằng Popconfirm
  const handleRevokeAccess = (key) => {
    setMembers(members.filter((member) => member.key !== key));
  };

  // Hiển thị menu chọn vai trò
  const roleMenu = (record) => (
    <Menu>
      <Menu.ItemGroup title="Select role">
        <Radio.Group
          value={record.role}
          onChange={(e) => handleRoleChange(record.key, e.target.value)}
          style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "5px" }}
        >
          <Radio value="Owner">Owner</Radio>
          <Radio value="Admin">Admin</Radio>
          <Radio value="Member">Member</Radio>
        </Radio.Group>
      </Menu.ItemGroup>
    </Menu>
  );

  // Cột của bảng
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ fontSize: "16px" }} />
          {text}
        </Space>
      ),
        sorter: (a, b) => a.name - b.name,
      width: "35%"
    },
    { title: "Email",
        dataIndex: "email",
         key: "email" ,
        sorter: (a, b) => a.email - b.email,
        width: "35%"
    },
      {
          title: "Role",
          dataIndex: "role",
          key: "role",
          render: (_, record) => (
              <Dropdown overlay={roleMenu(record)} trigger={["click"]}>
                  <Button style={{ width: "100%", textAlign: "left" }}>
                      {record.role} <DownOutlined style={{ float: "right" }} />
                  </Button>
              </Dropdown>
          ),
          sorter: (a, b) => a.role - b.role,
          width: "15%"
      },
    {
      title: <div style={{textAlign: "center"}}><span>Action</span></div>,
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to revoke access?"
          icon={<ExclamationCircleOutlined style={{ color: gold[6] }} />}
          onConfirm={() => handleRevokeAccess(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <div style={{textAlign: "center"}}><Button type="link" icon={<CloseCircleOutlined />} style={{fontSize: "1.5rem"}} danger /></div>
        </Popconfirm>
      ),
      width: "15%"
    },
  ];

  return (
    <div style={{ padding: "40px", textAlign: "left", backgroundColor: 'white'}}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "20px" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>MySite</Breadcrumb.Item>
        <Breadcrumb.Item>Members</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header với SearchBar, Filter, Invite Button */}
      <div style={{ display: "flex", marginBottom: "20px"}}>
        <div style={{ display: "flex", gap: "10px",  marginRight: "20px" }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search member"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        </div>

        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setInviteModalVisible(true)}>
          Invite more
        </Button>
      </div>

      <div style={{ display: "flex", marginBottom: "20px" }}>
        <p>Filter</p>
      <Select
            placeholder="All"
            allowClear
            style={{ width: 150, marginLeft: "20px",  alignItems: "center", marginTop: "8px", marginBottom: "10px" }}
            onChange={(value) => setSelectedRole(value)}
          >
            <Option value="All">All</Option>
            <Option value="Owner">Owner</Option>
            <Option value="Admin">Admin</Option>
            <Option value="Member">Member</Option>
          </Select>
      </div>

      {/* Bảng danh sách thành viên */}
      <Table 
      columns={columns} 
      dataSource={filteredMembers} 
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
      style={{
        width: "100%",
        borderRadius: "15px"
      }}
      />

      {/* Modal mời thành viên */}
      <Modal
        title="Invite member"
        visible={inviteModalVisible}
        onCancel={() => setInviteModalVisible(false)}
        footer={[
          <Button key="add" color={green[6]} variant="solid" onClick={() => setInviteModalVisible(false)}>
            Add
          </Button>,
          <Button key="cancel" color="danger" variant="solid" onClick={() => setInviteModalVisible(false)} danger>
            Cancel
          </Button>,
        ]}
      >
        <Title level={5}>User email addresses</Title>
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Enter email addresses"
          value={selectedEmails}
          onChange={setSelectedEmails}
          optionRender={(item) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <MailOutlined style={{ marginRight: 8 }} />
              {item.label}
            </div>
          )}
        >
        </Select>

      </Modal>
    </div>
  );
};

export default MembersManagement;
