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
const [selectedEmails, setSelectedEmails] = useState([]);
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
  // get site member
  fetchSiteMembers();
}, [])

useEffect(() => {
  // get user emails
  authAxios.get(`${userApi}/all`)
  .then(res => {
    const emails = res.data.reduce((acc, currUser) => {
      // laoi bo user khong active
      if(currUser.status !== "active"){
        return acc;
      }
      // loai bo user la thanh vien cua site
      const isSiteMember = currUser.site === user.site;
      if(!isSiteMember){
        acc.push ({
          value: currUser.email,
          label: currUser.email,
          avatar: currUser.userAvatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
          userId: currUser._id
        })
      }
      return acc;
    }, [])
    console.log(emails);
    setUserEmails(emails);
  })
  .catch(err => console.log(err))
},[])

const fetchSiteMembers = () => {
  authAxios.get(`${siteAPI}/get-by-user-id`).then(res => {
    setSite(res.data);
    setSiteRoles(res.data.siteRoles)
    authAxios.get(`${siteAPI}/${res.data._id}/get-site-members`).then(resMember => {
      // console.log(resMember.data)
      const memberData = resMember.data.map((member, index) => {
        return { key: index+1, siteMemberId: member._id._id, siteMemberName: member._id.username, siteMemberEmail: member._id.email, siteMemberRole: member.roles[0], siteMemberAvatar: member._id.userAvatar }
      })
      setSiteMembers(memberData)
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
 }

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

    // goi api den backend
    authAxios.post(`${siteAPI}/${site._id}/invite-member`, {receiver: selectedEmails})
    .then(res => console.log(res.data))
    .catch(err => console.log(err));

    messageApi.open({
      type: "success",
      content: `Send invitation to ${selectedEmails.toString()} successfully !`,
      duration: 2
    });
    showNotification(`👋 Invitation have been sent to ${selectedEmails.toString()} ✉`);
    setSelectedEmails([]);
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
          {siteRoles.map((role, index) => {
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
          Invite more
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
            {siteRoles.map(role => {
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
        mode="multiple" // Chỉ cho phép chọn từ danh sách có sẵn
        showSearch // Hiển thị ô tìm kiếm
        style={{ width: "100%" }}
        placeholder="Select user email"
        value={selectedEmails}
        onChange={setSelectedEmails}
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
