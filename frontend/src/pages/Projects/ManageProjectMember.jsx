import { useState } from "react";
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
  message,
  Layout,
  theme
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
  ArrowLeftOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { gold, gray, green } from "@ant-design/colors";
import { useLocation, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const ManageProjectMember = () => {
  //sider
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/').pop();

  const menuItems = [
    { key: 'back', icon: <ArrowLeftOutlined />, label: 'Project members', path: '/site/project' },
    { key: 'wdp', icon: <PictureOutlined style={{fontSize:"1.6rem"}}/>, label: <span style={{fontSize:"1.2rem", padding: 0}}>WDP301</span>, disabled: true },
    // { key: 'details', label: 'Details', path: '/site/project/details' },
    // { key: 'members', label: 'Members', path: '/site/project/members' },
    // { key: 'setting-a', label: 'Setting A', path: '/site/project/setting-a' },
    // { key: 'setting-b', label: 'Setting B', path: '/site/project/setting-b' },
    // { key: 'setting-c', label: 'Setting C', path: '/site/project/setting-c' },
  ];

  const handleClick = ({ key }) => {
    const clickedItem = menuItems.find(item => item.key === key);
    if (clickedItem && clickedItem.path) {
      navigate(clickedItem.path);
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();



  // content
  const [members, setMembers] = useState([
    { key: "1", name: "John", email: "John@gmail.com", role: "Project Manager" },
    { key: "2", name: "Alice", email: "Alice@gmail.com", role: "Project Member" },
    { key: "3", name: "Alice1", email: "Alice1@gmail.com", role: "Project Member" },
    { key: "4", name: "Alice2", email: "Alice2@gmail.com", role: "Project Member" },
    { key: "5", name: "Bob", email: "Bob@gmail.com", role: "Project Member" },
    { key: "6", name: "Bob", email: "Bob@gmail.com", role: "Project Member" },
    { key: "7", name: "Bob", email: "Bob@gmail.com", role: "Project Member" },
  ]);
  // State lưu role đang chọn
const [selectedRoles, setSelectedRoles] = useState(
  members.reduce((acc, member) => {
    acc[member.key] = member.role;
    return acc;
  }, {})
);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [messageApi, contexHolder] = message.useMessage();

  const handleEmailChange = (emails) => {
    const validEmails = emails.filter((email) => emailRegex.test(email));
    setSelectedEmails(validEmails);
  };

  const handleAddMember = () => {
    setAddMemberModalVisible(false);
    setMembers([...members, { key: ""+members.length+1, name: "Bob", email: "Bob@gmail.com", role: "Project Member" }])
    messageApi.open({
      type: "success",
      content: "Add members successfully",
      duration: 2
    });
  }

  // filter by name and role
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || !selectedRole || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });


 // Xử lý đổi vai trò
const handleRoleChange = (key, newRole) => {
  setSelectedRoles({ ...selectedRoles, [key]: newRole });
  setMembers(members.map((member) => (member.key === key ? { ...member, role: newRole } : member)));
};

  // Xử lý xóa thành viên bằng Popconfirm
  const handleRemoveMember = (key) => {
    setMembers(members.filter((member) => member.key !== key));
  };

  // Hiển thị menu chọn vai trò
const roleMenu = (record) => (
  <Menu>
    <Menu.ItemGroup title="Select role">
      <Radio.Group
        value={selectedRoles[record.key]}
        onChange={(e) => handleRoleChange(record.key, e.target.value)}
        style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "5px" }}
      >
        <Radio value="Project Manager" disabled>Project Manager</Radio>
        <Radio value="Project Member">Project Member</Radio>
      </Radio.Group>
    </Menu.ItemGroup>
  </Menu>
);

  // columns
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
          <Button style={{ width: "100%", textAlign: "left" }}>
            {selectedRoles[record.key]} <DownOutlined style={{ float: "right" }} />
          </Button>
        </Dropdown>
      ),
      sorter: (a, b) => a.role.localeCompare(b.role),
      width: "15%",
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
                  title="Are you sure to remove this member?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleRemoveMember(record.key)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text">Remove</Button>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      )
      ,
      width: "15%"
    },
  ];

  return (
    <Layout>
      {/* sider */}
      <Sider width={200} style={{ background: colorBgContainer }}>
              <Menu
                mode="inline"
                selectedKeys={[currentPath]}
                style={{ height: '100%', borderRight: 0 }}
                items={menuItems}
                onClick={handleClick}
              />
      </Sider>

      {/* content */}
      <div style={{ padding: "40px", paddingTop: '15px', textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)", width: "100%"}}>
      {/* hien thi message api */}
      {contexHolder}

      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "20px" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>MySite</Breadcrumb.Item>
        <Breadcrumb.Item>MyProject</Breadcrumb.Item>
        <Breadcrumb.Item>Members</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: "flex", marginBottom: "20px"}}>
        <div style={{ display: "flex", gap: "10px",  marginRight: "20px" }}>
          {/* search bar */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search member"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        </div>

        {/* add member button */}
        <Button type="primary" icon={<UserAddOutlined />} onClick={() => setAddMemberModalVisible(true)}>
          Add
        </Button>
      </div>


      {/* filter members by role */}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <p>Filter</p>
      <Select
            placeholder="All"
            allowClear
            style={{ width: 150, marginLeft: "20px",  alignItems: "center", marginTop: "8px", marginBottom: "10px" }}
            onChange={(value) => setSelectedRole(value)}
          >
            <Option value="All">All</Option>
            <Option value="Project Manager">Project Manager</Option>
            <Option value="Project Member">Project Member</Option>
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
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Enter email addresses"
          value={selectedEmails}
          onChange={handleEmailChange}
          tokenSeparators={[","]}
          optionRender={(item) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <MailOutlined style={{ marginRight: 8, color: gray[6] }} />
              {item.label}
            </div>
          )}
        />

      </Modal>
    </div>
    </Layout>
    
  );
};

export default ManageProjectMember;
