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
  const {projectSlug} = useParams();
  const {user, project, setProject, userApi, showNotification, projectAPI} = useContext(AppContext)
  // const projectAPI = `http://localhost:9999/sites/${user.site}/projects`
  const [userEmails, setUserEmails] = useState([]);
  

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
  // content
  const [projectMembers, setProjectMembers] = useState([
    { key: "1", projectMemberName: "John", projectMemberEmail: "John@gmail.com", projectMemberRole: "Project Manager" },
    { key: "2", projectMemberName: "Alice", projectMemberEmail: "Alice@gmail.com", projectMemberRole: "Project Member" },
  ]);

  const fetchData = async () => {
    try {
      // check slug
        // console.log(projectSlug);
    //get all project
    const allProjects = await authAxios.get(`${projectAPI}/get-all`);
    const currProject = allProjects.data.find(item => item.projectSlug === projectSlug);
    setProject(currProject)
    // console.log(currProject)

    //get project member
    const rawProjectMembers = await authAxios.get(`${projectAPI}/${project._id || currProject._id}/get-project-members`);
    const formattedProjectMembers = rawProjectMembers.data.map((member, index) => {
      return { 
        key: index+1,
        projectMemberId: member._id._id, 
        projectMemberName: member._id.username, 
        projectMemberEmail: member._id.email, 
        projectMemberRole: member.roles[0],
        projectMemberAvatar: member._id.userAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
      }})
    setProjectMembers(formattedProjectMembers);
    // console.log(rawProjectMembers)

    // get user emails
    const rawEmails = await authAxios.get(`${userApi}/all`);
    const filteredEmails = rawEmails.data.reduce((acc, currUser) => {
      const isSameSite = currUser.site !== user.site;
      const isNotProjectMember = formattedProjectMembers.find(member => member.projectMemberId === currUser?._id.toString()) === undefined ? true : false;
      // console.log(isNotProjectMember)
      // loai bo user khong la thanh vien cua site , khongla thanh vien cua project
      if(isSameSite && isNotProjectMember){
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
    } catch (error) {
      console.log(error)
    }
        
  }
  


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState();
  const [messageApi, contexHolder] = message.useMessage();

  const handleEmailChange = (email) => {
    setSelectedEmail(email);
  };

  const handleAddMember = async () => {
    if(selectedEmail === "" || selectedEmail === undefined){
      await messageApi.open({
        type: "error",
        content: "Please select site member email",
        duration: 2
      });
      return;
    }

    // lay user
    const currentUser = userEmails.find(user => user.value === selectedEmail)
    // console.log(currentUser)
    // call api
    await authAxios.post(`${projectAPI}/${project._id}/add-project-member`, {projectMemberId: currentUser.userId})

    setAddMemberModalVisible(false);
    showNotification(`Project member ${currentUser.value} has been add to project ${project?.projectName}`)
    await messageApi.open({
      type: "success",
      content: "Add project member successfully",
      duration: 2
    });

    // await fetchData();
    window.location.reload();
  }

  // filter by name and role
  const filteredMembers = projectMembers.filter((member) => {
    const matchesSearch = member.projectMemberName?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesRole = selectedRole === "All" || !selectedRole || member.projectMemberRole === selectedRole;
    return matchesSearch && matchesRole;
  });


 // Xử lý đổi vai trò
const handleRoleChange = (key, newRole) => {
  console.log("role changed")
  // setSelectedRoles({ ...selectedRoles, [key]: newRole });
  // setProjectMembers(projectMembers.map((member) => (member.key === key ? { ...member, role: newRole } : member)));
};

  // Xử lý xóa thành viên bằng Popconfirm
  const handleRemoveMember = async (key, projectMemberName, projectMemberId) => {
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
      // await fetchData();
      window.location.reload();
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
        onChange={(e) => handleRoleChange(record.key, e.target.value)}
        style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "5px" }}
      >
        {project?.projectRoles?.map(role => {
          return <Radio value={role} disabled={role === "projectManager"}>{formatRole(role)}</Radio>
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
                  onConfirm={() => handleRemoveMember(record.key, record.projectMemberName, record.projectMemberId)}
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
          onChange={handleEmailChange}
          tokenSeparators={[","]}
          options={userEmails || ["Not found"]}
          optionRender={(item) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar src={item.data.avatar} style={{ marginRight: 8, color: gray[6] }} />
              {item.label}
            </div>
          )}
        />

      </Modal>
    </div>
  );
};

export default ManageProjectMember;
