import React, { useContext, useEffect, useRef, useState } from "react";
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

const membersMockData = [
  { key: "1", siteMemberName: "John", siteMemberEmail: "John@gmail.com", siteMemberRole: "Owner" },
  { key: "2", siteMemberName: "Alice", siteMemberEmail: "Alice@gmail.com", siteMemberRole: "Member" },
];

const mockEmailOptions = [
  { value: "user1@example.com", label: "user1@example.com" },
  { value: "user2@example.com", label: "user2@example.com" },
  { value: "user3@example.com", label: "user3@example.com" },
]

const breadCrumbItems = [
  {
    title: <a href="/home">Home</a>
  },
  {
    title: <a href="/site">Site</a>
  },
  {
    title: "Manage site members"
  }
]


const ManageSiteMembers = () => {
  const {user, site, setSite, siteAPI, userApi, showNotification} = useContext(AppContext);
  const [siteMembers, setSiteMembers] = useState(membersMockData);
  const [siteRoles, setSiteRoles] = useState([]);
  const [userEmails, setUserEmails] = useState(mockEmailOptions);
  const [searchEmail, setSearchEmail] = useState("");
const [filterStatus, setFilterStatus] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [selectedFilterRole, setSelectedFilterRole] = useState(null);
const [inviteModalVisible, setInviteModalVisible] = useState(false);
const [selectedEmail, setSelectedEmail] = useState();
const [messageApi, contexHolder] = message.useMessage();
const nav = useNavigate();
const emailRegex = /^[a-zA-Z0-9._%+-]+[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const formatRole = (memberRole) => {
  let role;
      if(memberRole === "siteOwner" || memberRole === "Owner"){
        role = "Site Owner"
      }else if(memberRole === "siteMember" || memberRole === "Member"){
        role = "Site Member"
      }else{
        role = "Undefined?"
      }
  return role;
}

useEffect(() => {
  console.clear();

  fetchData();
},[site])

const fetchData = async () => {
  try {
    //get site member
  // const siteData = await authAxios.get(`${siteAPI}/get-by-user-id`);
  // setSite(siteData.data);
  setSiteRoles(site.siteRoles);

  const siteMemberData = await authAxios.get(`${siteAPI}/${site?._id}/get-site-members`);
  const memberData = siteMemberData.data.map((member, index) => {
    return { key: index+1, siteMemberId: member._id._id, siteMemberName: member._id.username, siteMemberEmail: member._id.email, siteMemberRole: member.roles[0], siteMemberAvatar: member._id.userAvatar }
  })
  setSiteMembers(memberData)

  // console.log("site roles: ",site.siteRoles)
  // console.log("site member: ",memberData)
  // get user emails
    const allEmailData = await authAxios.get(`${userApi}/all`);
    const emails = allEmailData.data.reduce((acc, currUser) => {
      // laoi bo user khong active
      const isActive = currUser.status === "active"
      // loai bo user la thanh vien cua site
      const isSiteMember = currUser.site === user.site;
      // loai bo user co site roi
      const isNotInSite = currUser.site === undefined;
      if (!isSiteMember && isActive && isNotInSite) {
        acc.push({
          value: currUser.email,
          label: currUser.email,
          avatar: currUser.userAvatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
          userId: currUser._id
        })
      }
      return acc;
    }, [])
    setUserEmails(emails);
    console.log(emails);

  } catch (error) {
    console.log(error)
  }
 }

  const handleInviteMember = async () => {
    const invitedUserId = userEmails.find(item => item.value === selectedEmail).userId;
    console.log(selectedEmail)

    // goi api den backend
    await authAxios.post(`${siteAPI}/${site._id}/invite-member`, {receiverId: invitedUserId})

    messageApi.open({
      type: "success",
      content: `Send invitation to ${selectedEmail.toString()} successfully !`,
      duration: 2
    });
    showNotification(`👋 Invitation have been sent to ${selectedEmail.toString()} ✉`);
    setSelectedEmail();

    setInviteModalVisible(false);
    await fetchData();
  }

  // Xử lý tìm kiếm
  let filteredMembers;
  if(selectedFilterRole !== "All"){
    filteredMembers = siteMembers.filter(
        (member) =>
          member.siteMemberName?.toLowerCase().includes(searchTerm?.toLowerCase()) &&
          (!selectedFilterRole || member.siteMemberRole === selectedFilterRole)
      );
  }else{
    filteredMembers = siteMembers.filter(
      (member) =>
        member.siteMemberName?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }

  // Xử lý đổi vai trò
const handleRoleChange = (siteMemberId, oldRole, newRole) => {
  console.log("role changed", siteMemberId, oldRole, newRole)
  // setSiteMembers(siteMembers.map((member) => (member.key === key ? { ...member, siteMemberRole: formatRole(newRole) } : member)));
};

  // Xử lý xóa thành viên bằng Popconfirm
  const handleRevokeAccess = async (key, name, sitememberid) => {
    //call api
    await authAxios.delete(`${siteAPI}/${site._id}/revoke-site-member-access/${sitememberid}`)
    .then(res => {
      // console.log(res.data);
      if(res.data.site){
        const siteMember = res.data.site.siteMember;
        setSiteMembers(siteMember);
      }
      
    })
    .catch(err => console.log(err))
    
    // show thong bao
    messageApi.open({
      type: "success",
      content: `Revoke access 🔒 member ${name} successfully!`,
      duration: 2
    });
    showNotification(`Member ${name} has been revoke access 🔒 from site ${site.siteName}`);
  };

  // Hiển thị menu chọn vai trò
  const roleMenu = (record) => (
    <Menu>
      <Menu.ItemGroup title="Select role">
        <Radio.Group
          value={record.siteMemberRole}
          onChange={(e) => handleRoleChange(record.siteMemberId, record.siteMemberRole, e.target.value)}
          style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "5px" }}
        >
          {siteRoles?.map((role, index) => {
            return (
              <Radio key={index} value={role} disabled={role === "siteOwner"}>
                {formatRole(role)}
              </Radio>
            );
          })}
        </Radio.Group>
      </Menu.ItemGroup>
    </Menu>
  );

  // Cột của bảng
  const columns = [
    {
      title: "Name",
      dataIndex: "siteMemberName",
      key: "siteMemberName",
      render: (text, record) => (
        <Space>
          <Avatar src={record.siteMemberAvatar} style={{ fontSize: "16px" }} />
          {text}
        </Space>
      ),
        sorter: (a, b) => a.siteMemberName.localeCompare(b.siteMemberName),
      width: "35%"
    },
    { title: "Email",
        dataIndex: "siteMemberEmail",
         key: "siteMemberEmail" ,
        sorter: (a, b) => a.siteMemberEmail.localeCompare(b.siteMemberEmail),
        width: "35%"
    },
      {
          title: "Role",
          dataIndex: "siteMemberRole",
          key: "siteMemberRole",
          render: (_, record) => (
              <Dropdown overlay={roleMenu(record)} trigger={["click"]} 
              disabled={record.siteMemberRole === "siteOwner"}
              >
                <Button style={{ width: "100%", textAlign: "left" }}>
            { 
              formatRole(record.siteMemberRole)
            } <DownOutlined style={{ float: "right" }} />
          </Button>
              </Dropdown>
          ),
          sorter: (a, b) => a.siteMemberRole.localeCompare(b.siteMemberRole),
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
                  onConfirm={() => handleRevokeAccess(record.key, record.siteMemberName, record.siteMemberId)}
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
          {record.siteMemberRole === "siteMember" && <Button icon={<MoreOutlined />} type="text" />}
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
          Invite
        </Button>

      </div>

      <div style={{ display: "flex", marginBottom: "20px" }}>
        <p>Filter</p>
      <Select
            placeholder="All"
            allowClear
            style={{ width: 150, marginLeft: "20px",  alignItems: "center", marginTop: "8px", marginBottom: "10px" }}
            onChange={(value) => setSelectedFilterRole(value)}
          >
            <Option value="All">All</Option>
            {siteRoles?.map(role => {
              const formattedRole = formatRole(role);
              return <Option value={role}>{formattedRole}</Option>
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
        showSearch // Hiển thị ô tìm kiếm
        style={{ width: "100%" }}
        placeholder="Select user email"
        value={selectedEmail}
        onChange={setSelectedEmail}
        options={userEmails}
        filterOption={(input, option) =>
          option.label?.toLowerCase().includes(input?.toLowerCase())
        } // Lọc email theo từ khóa nhập vào
        optionRender={(item) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar src={item.data.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} style={{ marginRight: 8 }} />
            {item.label}
          </div>
        )}
      />
    </Modal>

    </div>
  );
};

export default ManageSiteMembers;
