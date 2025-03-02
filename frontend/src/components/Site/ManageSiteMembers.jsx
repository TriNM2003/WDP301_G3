import React, { useContext, useState } from "react";
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
  message
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
  MoreOutlined,
} from "@ant-design/icons";
import { gold, gray, green } from "@ant-design/colors";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const ManageSiteMembers = () => {
  const [members, setMembers] = useState([
    { key: "1", name: "John", email: "John@gmail.com", role: "Owner" },
    { key: "2", name: "Alice", email: "Alice@gmail.com", role: "Member" },
    { key: "3", name: "Bob", email: "Bob@gmail.com", role: "Access Admin" },
    { key: "4", name: "Bob", email: "Bob@gmail.com", role: "Member" },
    { key: "5", name: "Bob", email: "Bob@gmail.com", role: "Member" },
    { key: "6", name: "Bob", email: "Bob@gmail.com", role: "Member" },
    { key: "7", name: "Bob", email: "Bob@gmail.com", role: "Member" },
  ]);
  const breadCrumbItems = [
    {
      title: <a href="/home">Home</a>
    },
    {
      title: <a href="/site">Site</a>
    },
    {
      title: "Manage Member"
    }
  ]

  const [currSite, setCurrSite] = useState({siteName: "exmaplegggg123"});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [messageApi, contexHolder] = message.useMessage();
  const {showNotification} = useContext(AppContext)
  const nav = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleInviteMember = async () => {
    setInviteModalVisible(false);
    for(let i=0; i< selectedEmails.length; i++){
      if(!emailRegex.test(selectedEmails[i])){
        await messageApi.open({
          type: "error",
          content: `Email ${selectedEmails[i]} is not a valid email!`,
          duration: 2
        });
        return;
      }
    }
    messageApi.open({
      type: "success",
      content: `Send invitation to ${selectedEmails.toString()} successfully !`,
      duration: 2
    });
    showNotification(`👋 Invitation have been sent to ${selectedEmails.toString()} ✉`);
  }


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
  const handleRevokeAccess = (key, name) => {
    setMembers(members.filter((member) => member.key !== key));
    // show thong bao
    messageApi.open({
      type: "success",
      content: `Revoke access 🔒 member ${name} successfully!`,
      duration: 2
    });
    showNotification(`Member ${name} has been revoke access 🔒 from site ${currSite.siteName}`);
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
          {/* <Radio value="Owner">Owner</Radio> */}
          <Radio value="Owner" disabled>Owner</Radio>
          <Radio value="Access Admin">Access Admin</Radio>
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
        sorter: (a, b) => a.name.localeCompare(b.name),
      width: "35%"
    },
    { title: "Email",
        dataIndex: "email",
         key: "email" ,
        sorter: (a, b) => a.email.localeCompare(b.email),
        width: "35%"
    },
      {
          title: "Role",
          dataIndex: "role",
          key: "role",
          render: (_, record) => (
              <Dropdown overlay={roleMenu(record)} trigger={["click"]}>
                {record.role === "Owner" ? 
                <Button style={{ width: "100%", textAlign: "left" }} disabled>
                      {record.role} <DownOutlined style={{ float: "right" }} />
                  </Button>
                  :
                  <Button style={{ width: "100%", textAlign: "left" }}>
                      {record.role} <DownOutlined style={{ float: "right" }} />
                  </Button>
                }
              </Dropdown>
          ),
          sorter: (a, b) => a.role.localeCompare(b.role),
          width: "15%"
      },
    {
      title: <div style={{textAlign: "center"}}><span>Action</span></div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="kick">
                <Popconfirm
                  title="Are you sure to revoke access?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleRevokeAccess(record.key, record.name)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text">Revoke access</Button>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          {record.role === "Member" && <Button icon={<MoreOutlined />} type="text" />}
        </Dropdown>
      )
      ,
      width: "15%"
    },
  ];

  return (
    <div style={{ padding: "40px", textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)", width: "100%"}}>
      {/* hien thi message api */}
      {contexHolder}

      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "20px" }} items={breadCrumbItems} />

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
            <Option value="Access Admin">Access Admin</Option>
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
          <Button key="add" color={green[6]} variant="solid" onClick={() => handleInviteMember()}>
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

export default ManageSiteMembers;
