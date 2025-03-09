import { useContext, useEffect, useState } from "react";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import {AppContext} from "../../context/AppContext"
import authAxios from "../../utils/authAxios";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const breadCrumbItems = [
  {
    title: <a href="/Home">Home</a>
  },
  {
    title: <a href="/site">Site</a>
  },
  {
    title: <a href="/site/project">Project</a>
  },
  {
    title: "Manage project members"
  }
]


const ManageProjectMember = () => {
  // state
  const {projectSlug} = useParams();
  const {user, project, setProject, userApi, showNotification, projectAPI} = useContext(AppContext)
  const [userEmails, setUserEmails] = useState([]);
  const [projectRoles, setProjectRoles] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState();
  const [selectMemberRole, setSelectedMemberRole] = useState();
  const [messageApi, contexHolder] = message.useMessage();
  const nav = useNavigate();
  
  // filter by name and role
  const filteredMembers = projectMembers.filter((member) => {
    const matchesSearch = member.projectMemberName?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesRole = selectedRole === "All" || !selectedRole || member.projectMemberRole === selectedRole;
    return matchesSearch && matchesRole;
  });

  
 // use effect
  useEffect(() => {
    if(!projectSlug){
      messageApi.open({
        type: "error",
        content: "Project name not found",
        duration: 2
      });
    }
    fetchData();
  },[projectSlug])

  const formattedProjectMembers = (rawProjectMembers) => {
    return rawProjectMembers.map((member, index) => {
    return { 
      key: index+1,
      projectMemberId: member._id._id, 
      projectMemberName: member._id.username, 
      projectMemberEmail: member._id.email, 
      projectMemberRole: member.roles[0],
      projectMemberAvatar: member._id.userAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    }})

  } 

  const fetchData = async () => {
    try {
      console.clear()
    const allProjects = await authAxios.get(`${projectAPI}/get-all`);
    const currProject = allProjects.data.find(item => item.projectSlug === projectSlug);
    setProject(currProject)
    //get project member
    const rawProjectMembers = await authAxios.get(`${projectAPI}/${project._id || currProject._id}/get-project-members`);
    const projectMember = formattedProjectMembers(rawProjectMembers.data);
    setProjectMembers(projectMember);
    // get user emails
    const rawEmails = await authAxios.get(`${userApi}/all`);
    const filteredEmails = rawEmails.data.reduce((acc, currUser) => {
      const isSameSite = currUser.site === user.site;
      const isProjectMember = projectMember.find(member => member.projectMemberId === currUser?._id.toString()) !== undefined;
      const isActive = currUser.status === "active";
      // loai bo user khong la thanh vien cua site , khongla thanh vien cua project
      if(!isSameSite && !isProjectMember && isActive){
        acc.push ({
          value: currUser.email,
          label: currUser.email,
          avatar: currUser.userAvatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
          userId: currUser._id
        })
      }
      return acc;
    }, [])
    setUserEmails(filteredEmails);
    // set project roles for add member
    const roleList = project.projectRoles.map(role => {
      return {
        value: role,
        label: formatRole(role),
      }
    })
    console.log(roleList)
    setProjectRoles(roleList);
    } catch (error) {
      console.log(error)
      // nav("/home")
    }
        
  }

  const formatRole = (memberRole) => {
    let role;
        if(memberRole === "projectManager" || memberRole === "Manager"){
          role = "Project Manager"
        }else if(memberRole === "projectMember" || memberRole === "Member"){
          role = "Project Member"
        }else{
          role = "Undefined?"
        }
    return role;
  }

  const handleAddMember = async () => {
    console.clear();
    if(selectedEmail === "" || selectedEmail === undefined){
      await messageApi.open({
        type: "error",
        content: "Please select site member email",
        duration: 2
      });
      return;
    }
    // console.log(selectedEmail, selectMemberRole)
    // return;
    // lay user
    const currentUser = userEmails.find(user => user.value === selectedEmail)
    // console.log(currentUser)
    // call api
   const newProjectMemberListRaw = await authAxios.post(`${projectAPI}/${project._id}/add-project-member`, 
    { projectMemberId: currentUser.userId,
      projectMemberRole: selectMemberRole
    })
    // hien thi thong bao thanh cong
    setAddMemberModalVisible(false);
    showNotification(`Project member ${currentUser.value} has been add to project ${project?.projectName}`)
    await messageApi.open({
      type: "success",
      content: "Add project member successfully",
      duration: 2
    });
    // cap nhap du lieu moi
    const newEmailList = userEmails.filter(email => email.value !== selectedEmail);
    setUserEmails(newEmailList);
    setSelectedEmail();
    const newProjectMemberList = formattedProjectMembers(newProjectMemberListRaw.data);
    setProjectMembers(newProjectMemberList);
    setSelectedMemberRole();
  }

 // Xử lý đổi vai trò
const handleRoleChange = async (key, newRole, projectMemberId, projectMemberName) => {
  console.log("role changed: ", newRole, projectMemberId)
  const res = await authAxios.put(`${projectAPI}/${project._id}/edit-project-member`, 
    {newRole: newRole,
      projectMemberId: projectMemberId
    }
  )
  console.log(res.data)

  showNotification(`Project member ${projectMemberName} role has been changed to ${formatRole(newRole)}`)
    await messageApi.open({
      type: "success",
      content: "Change project member role successfully",
      duration: 2
    });

    const newProjectMemberList = formattedProjectMembers(res.data);
    setProjectMembers(newProjectMemberList);

  // setSelectedRoles({ ...selectedRoles, [key]: newRole });
  // setProjectMembers(projectMembers.map((member) => (member.key === key ? { ...member, role: newRole } : member)));
};


  // Xử lý xóa thành viên
  const handleRemoveMember = async (key, projectMemberName, projectMemberId, projectMemberAvatar, projectMemberEmail) => {
    try {
      // console.log(projectMemberName, projectMemberId)
      const response = await authAxios.delete(`${projectAPI}/${project._id}/remove-project-member`, 
        { data: {
          projectMemberId: projectMemberId
        } });
      console.log(response.data)

      showNotification(`Project member ${projectMemberName} has been removed from project ${project?.projectName}`)
      await messageApi.open({
        type: "success",
        content: "Remove project member successfully",
        duration: 2
      });
      // cap nhap du lieu moi
    const newEmailList = [...userEmails, {
      value: projectMemberEmail,
      label: projectMemberEmail,
      avatar: projectMemberAvatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
      userId: projectMemberId
    }];
    setUserEmails(newEmailList);
    setSelectedEmail();
    const newProjectMemberList = formattedProjectMembers(response.data);
    setProjectMembers(newProjectMemberList);
    } catch (error) {
      console.log(error)
    }
  };



  // Hiển thị menu chọn vai trò
const roleMenu = (record) => (
  <Menu>
    <Menu.ItemGroup title="Select role">
      <Radio.Group
        value={record.projectMemberRole}
        onChange={(e) => handleRoleChange(record.key, e.target.value, record.projectMemberId, record.projectMemberName)}
        style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "5px" }}
      >
        {project?.projectRoles?.map(role => {
          return <Radio value={role}>{formatRole(role)}</Radio>
        })}
      </Radio.Group>
    </Menu.ItemGroup>
  </Menu>
);

  // columns
  const columns = [
    {
      title: "Name",
      dataIndex: "projectMemberName",
      key: "projectMemberName",
      render: (text, record) => (
        <Space>
          <Avatar src={record.projectMemberAvatar} style={{ fontSize: "16px" }} />
          {text}
        </Space>
      ),
        sorter: (a, b) => a.projectMemberName.localeCompare(b.projectMemberName),
      width: "35%"
    },
    { title: "Email",
        dataIndex: "projectMemberEmail",
         key: "projectMemberEmail" ,
        sorter: (a, b) => a.projectMemberEmail.localeCompare(b.projectMemberEmail),
        width: "35%"
    },
    {
      title: "Role",
      dataIndex: "projectMemberRole",
      key: "projectMemberRole",
      render: (_, record) => (
        <Dropdown overlay={roleMenu(record)} trigger={["click"]}>
          <Button style={{ width: "100%", textAlign: "left" }}>
            {formatRole(record.projectMemberRole)} <DownOutlined style={{ float: "right" }} />
          </Button>
        </Dropdown>
      ),
      sorter: (a, b) => a.projectMemberRole.localeCompare(b.projectMemberRole),
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
                  onConfirm={() => handleRemoveMember(record.key, record.projectMemberName, record.projectMemberId, record.projectMemberAvatar, record.projectMemberEmail)}
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
          <Button icon={<MoreOutlined />} type="text"  disabled={record.projectMemberRole === "projectManager"}/>
        </Dropdown>
      )
      ,
      width: "15%"
    },
  ];

  return (
      <div style={{ padding: "40px", paddingTop: '15px', textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)", width: "100%"}}>
      {/* hien thi message api */}
      {contexHolder}

      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "20px" }} items={breadCrumbItems} />

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
            {project?.projectRoles?.map(role => {
              return <Option value={role}>{formatRole(role)}</Option>
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

      {/* Modal add thành viên */}
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
          style={{ width: "100%" }}
          placeholder="Enter email addresses"
          value={selectedEmail}
          onChange={setSelectedEmail}
          tokenSeparators={[","]}
          options={userEmails || ["Not found"]}
          optionRender={(item) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar src={item.data.avatar} style={{ marginRight: 8, color: gray[6] }} />
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
          tokenSeparators={[","]}
          options={[{value: "projectManager", label: "Project Manager"},
                {value: "projectMember", label: "Project Member"},
           ]|| ["Not found"]}
        />

      </Modal>
    </div>
  );
};

export default ManageProjectMember;
