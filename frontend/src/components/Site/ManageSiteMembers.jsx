import React, { useContext, useEffect, useState } from "react";
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
import { green, red } from "@ant-design/colors";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import authAxios from "../../utils/authAxios";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const siteApi = "http://localhost:9999/sites"
const userApi = "http://localhost:9999/users"
const membersMockData = [
  { key: "1", name: "John", email: "John@gmail.com", role: "Owner" },
  { key: "2", name: "Alice", email: "Alice@gmail.com", role: "Member" },
  { key: "3", name: "Bob", email: "Bob@gmail.com", role: "Access Admin" },
  { key: "4", name: "Bob", email: "Bob@gmail.com", role: "Member" },
  { key: "5", name: "Bob", email: "Bob@gmail.com", role: "Member" },
  { key: "6", name: "Bob", email: "Bob@gmail.com", role: "Member" },
  { key: "7", name: "Bob", email: "Bob@gmail.com", role: "Member" },
];

const mockEmailOptions = [
  { value: "user1@example.com", label: "user1@example.com" },
  { value: "user2@example.com", label: "user2@example.com" },
  { value: "user3@example.com", label: "user3@example.com" },
]

const invitationsMockData = [
  { key: "1", email: "invite1@example.com", status: "pending" },
  { key: "2", email: "invite2@example.com", status: "accept" },
  { key: "3", email: "invite3@example.com", status: "decline" },
  { key: "4", email: "invite4@example.com", status: "accept" },
  { key: "5", email: "invite5@example.com", status: "accept" },
  { key: "6", email: "invite6@example.com", status: "accept" },
];

const ManageSiteMembers = () => {
  const {user} = useContext(AppContext);
  const [members, setMembers] = useState(membersMockData);
  const [siteRoles, setSiteRoles] = useState([]);
  const [userEmails, setUserEmails] = useState(mockEmailOptions);

  const [invitationModalVisible, setInvitationModalVisible] = useState(false);
const [invitations, setInvitations] = useState(invitationsMockData);

const formatRole = (memberRole) => {
  let role;
      if(memberRole === "siteOwner"){
        role = "Site Owner"
      }else if(memberRole === "siteMember"){
        role = "Site Member"
      }else{
        role = "Undefined?"
      }
  return role;
}

useEffect(() => {
  // get site member
  authAxios.get(`${siteApi}/${user.site}`)
  .then(res => {
    const membersData = res.data.siteMember.map((member, index) => {
      return {
        index: index+1,
        name: member._id.username,
        email: member._id.email,
        memberAvatar: member._id.userAvatar,
        role: formatRole(member.roles[0])
      }
    })
    console.log(membersData);
    setSiteRoles(res.data.siteRoles);
    setMembers(membersData)
  })
  .catch(err => console.log(err))

  // get user emails
  authAxios.get(`${userApi}/all`)
  .then(res => {
    const emails = res.data.reduce((acc, currUser) => {
      // loai bo user la thanh vien cua site
      if(currUser.site !== user.site){
        acc.push ({
          value: currUser.email,
          label: currUser.email,
          avatar: currUser.userAvatar,
          userId: currUser._id
        })
      }
      return acc;
    }, [])
    console.log(emails);
    setUserEmails(emails);
  })
  .catch(err => console.log(err))
}, [user.site])


const invitationColumns = [
  { title: "Email", dataIndex: "email", key: "email" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => (
      <span style={{ color: text === "accept" ? green[6] : text === "decline" ? red[6] : "inherit" }}>
        {text}
      </span>
    ),
  },  
  {
    title: "Action",
    key: "action",
    render: (_, record) =>
      record.status === "pending" ? (
        <Popconfirm
          title="Are you sure to delete this invitation?"
          onConfirm={() => handleDeleteInvitation(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ) : null,
  },
];

const [searchEmail, setSearchEmail] = useState("");
const [filterStatus, setFilterStatus] = useState(null);

const filteredInvitations = invitations.filter((invite) =>
  invite.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
  (!filterStatus || invite.status === filterStatus)
);


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
    // for(let i=0; i< selectedEmails.length; i++){
    //   if(!emailRegex.test(selectedEmails[i])){
    //     await messageApi.open({
    //       type: "error",
    //       content: `Email ${selectedEmails[i]} is not a valid email!`,
    //       duration: 2
    //     });
    //     return;
    //   }
    // }

    // goi api den backend


    messageApi.open({
      type: "success",
      content: `Send invitation to ${selectedEmails.toString()} successfully !`,
      duration: 2
    });
    showNotification(`👋 Invitation have been sent to ${selectedEmails.toString()} ✉`);
    setSelectedEmails([]);
  }

  const handleDeleteInvitation = (key) => {
    setInvitations(invitations.filter((invite) => invite.key !== key));
    messageApi.success("Pending invitation deleted successfully!");
  };
  

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
          {siteRoles.map(role => {
            const formattedRole = formatRole(role);
            if(formattedRole === "Site Owner"){
              return <Radio value={formattedRole} disabled>{formattedRole}</Radio>
            }else{
              return <Radio value={formattedRole}>{formattedRole}</Radio>
            }
          })}
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
      render: (text, record) => (
        <Space>
          <Avatar src={record.memberAvatar} style={{ fontSize: "16px" }} />
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
                {record.role === "Site Owner" ? 
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
        {/* <Button icon={<MailOutlined />} danger onClick={() => setInvitationModalVisible(true)}
        style={{marginLeft: "20px"}}>
        Manage Invitations
        </Button> */}

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
            {siteRoles.map(role => {
              const formattedRole = formatRole(role);
              return <Option value={formattedRole}>{formattedRole}</Option>
            })}
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
        mode="multiple" // Chỉ cho phép chọn từ danh sách có sẵn
        showSearch // Hiển thị ô tìm kiếm
        style={{ width: "100%" }}
        placeholder="Select user email"
        value={selectedEmails}
        onChange={setSelectedEmails}
        options={userEmails}
        filterOption={(input, option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        } // Lọc email theo từ khóa nhập vào
        optionRender={(item) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar src={item.data.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} style={{ marginRight: 8 }} />
            {item.label}
          </div>
        )}
      />
    </Modal>

      <Modal
  title="Manage Invitations"
  visible={invitationModalVisible}
  onCancel={() => setInvitationModalVisible(false)}
  footer={null}
  bodyStyle={{ height: "400px", overflowY: "auto" }}
>
<Input
  prefix={<SearchOutlined />}
  placeholder="Search by email"
  value={searchEmail}
  onChange={(e) => setSearchEmail(e.target.value)}
  style={{ marginBottom: 10 }}
/>

<Select
  placeholder="Filter by status"
  style={{ width: "100%", marginBottom: 10 }}
  allowClear
  onChange={(value) => setFilterStatus(value)}
>
  <Select.Option value="pending">Pending</Select.Option>
  <Select.Option value="accept">Accept</Select.Option>
  <Select.Option value="decline">Decline</Select.Option>
</Select>

  <Table columns={invitationColumns} dataSource={filteredInvitations} pagination={false} />
</Modal>

    </div>
  );
};

export default ManageSiteMembers;
