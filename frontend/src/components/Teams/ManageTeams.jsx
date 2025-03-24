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
  theme,
  Form,
  Upload
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
  TeamOutlined,
  UploadOutlined,
  InboxOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { blue, gold, gray, green, red } from "@ant-design/colors";
import { useLocation, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { AppContext } from "../../context/AppContext";
import CreateTeam from "./CreateTeam";
import authAxios from "../../utils/authAxios";

  
const breadCrumbItems = [
  {
    title: <a href="/Home">Home</a>
  },
  {
    title: <a href="/site">Site</a>
  },
  {
    title: "Manage teams"
  }
]


const ManageTeams = () => {
    const {teams, setTeams, site, siteAPI, showNotification, user, setRefreshNoti} = useContext(AppContext);
    const [tableData, setTableData] = useState([]);
    const nav = useNavigate();
    const teamApi = `http://localhost:9999/sites/${site?._id}/teams`;

  useEffect(function(){
    setTeamData();
  }, [teams, site])

  async function fetchTeams(){
    try {
      const res = await authAxios.get(`${siteAPI}/${site._id}/teams/get-teams-in-site`)
      setTeams(res.data);
    } catch (error) {
      console.log(error)
    }
  }

  async function setTeamData(){
    try {
      const data =  teams?.map(function(team, index){
        const teamLeader = team.teamMembers.find(member => member.roles.includes("teamLeader"));
        return {
          key: index+1,
          teamId: team?._id,
          teamName: team?.teamName,
          teamLeader: teamLeader?._id.email,
          teamAvatar: team?.teamAvatar,
          teamLeaderAvatar: teamLeader?._id.userAvatar,
          teamSlug: team?.teamSlug,
          createDate: team?.createdAt,
          updateDate: team?.updatedAt
        }
      })
      setTableData(data)
      // console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  // dung de sort date string
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    console.log(new Date(year, month - 1, day))
    return new Date(year, month - 1, day);
  };

  const formatDate = (mongoDate) => {
    if (!mongoDate) return "";
  
    const date = new Date(mongoDate);
    return date.toLocaleDateString("vi-VN"); // "dd/mm/yyyy"
  };


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [messageApi, contexHolder] = message.useMessage();
  const [createTeamModal, setCreateTeamModal] = useState(false);

  const handleCreateTeam = () => {
    console.log("create team");
    setRefreshNoti(prev => !prev);
  }

  async function handleRemoveTeam(teamId, teamName){
    try {
      const response =  await authAxios.delete(`${teamApi}/${teamId}/remove-team`);
      // await fetchTeams();
      await message.success(response.data.result, 2);
      await showNotification("Team", `Team ${teamName} has been removed by site owner ${user?.email}`);
      window.location.reload();
    } catch (error) {
       console.log(error)
       setTeams([]);
       setTeamData([])
    }
  }

  // columns
  const columns = [
    {
      title: "Team name",
      dataIndex: "teamName",
      key: "teamName",
      render: (text, record) => (
        <Space>
          <Avatar src={record.teamAvatar} />
          <span onClick={() => nav(`/site/teams/${record?.teamSlug}`)} style={{cursor: "pointer"}}>{text}</span>
        </Space>
      ),
        sorter: (a, b) => a.teamName.localeCompare(b.teamName),
      width: "20%"
    },
    { title: "Team leader",
        dataIndex: "teamLeader",
         key: "teamLeader" ,
         render: (text, record) => (
            <Space>
              <Avatar src={record.teamLeaderAvatar} />
              {text}
            </Space>
          ),
        sorter: (a, b) => a.teamLeader.localeCompare(b.teamLeader),
        width: "20%"
    },
    { title: "Created date",
        dataIndex: "createDate",
         key: "createDate",
         render: (text) => formatDate(text),
        sorter: (a, b) => parseDate(a.createDate) - parseDate(b.createDate),
        width: "20%"
    },
    { title: "Last updated",
        dataIndex: "updateDate",
         key: "updateDate" ,
         render: (text) => formatDate(text),
        sorter: (a, b) => parseDate(a.updateDate) - parseDate(b.updateDate),
        width: "20%"
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
                  title="Are you sure to remove this team?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleRemoveTeam(record.teamId, record.teamName)}
                  okText="Yes"
                  cancelText="No"
                >
                  <span style={{color: red[6]}}><DeleteOutlined /> Remove team</span>
                </Popconfirm>
              </Menu.Item>

              {/* <Menu.Item key="manageTeamMember" onClick={() => nav("/site/team/manage-member")}>
                <span style={{color: blue[6]}}><EditOutlined /> Manage team members</span>
              </Menu.Item> */}
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      )
      ,
      width: "20%"
    },
  ];

  return (
      <div style={{ padding: "40px", paddingTop: '15px', textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)", width: "100%"}}>
      {/* hien thi message api */}
      {contexHolder}

      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "20px" }} items={breadCrumbItems} />

      <div style={{ display: "flex", marginBottom: "20px", width: "100%", justifyContent: "space-between"}}>
        <div style={{ display: "flex", gap: "10px",  marginRight: "20px" }}>
          {/* search bar */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search team"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        </div>

        {/* add team button */}
        <Button type="primary" icon={<TeamOutlined />} onClick={() => setCreateTeamModal(true)}>
          Add team
        </Button>
      </div>


      {/* Bảng danh sách thành viên */}
      <Table 
      columns={columns} 
      dataSource={tableData} 
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
      style={{
        width: "100%",
        borderRadius: "15px"
      }}
      />

      <CreateTeam visible={createTeamModal} onCreate={handleCreateTeam} onCancel={() => setCreateTeamModal(false)} />

      <Modal
        title="Add team"
        visible={addMemberModalVisible}
        onCancel={() => setAddMemberModalVisible(false)}
        footer={false}
      >
              <Form
                  name="basic"
                  labelCol={{
                      span: 8,
                  }}
                  wrapperCol={{
                      span: 16,
                  }}
                  style={{
                      maxWidth: "100%",
                  }}
                  initialValues={{
                      remember: true,
                  }}
                  onFinish={() => console.log("success")}
                  onFinishFailed={() => console.log("failed")}
                  autoComplete="off"
              >
                  <Form.Item
                      label="Team name"
                      name="teamName"
                      rules={[
                          {
                              required: true,
                              min: 3,
                              message: 'Please input at least 3 character!',
                          },
                      ]}
                  >
                      <Input />
                  </Form.Item>

                  <Form.Item
                      label="Team members"
                      name="teamLeader"
                      rules={[
                          {
                              required: true,
                              message: 'Please input team leader!',
                          },
                      ]}
                  >
                      <Input />
                  </Form.Item>

          <div style={{marginLeft: "5%"}}>
            <Button key="add" style={{color: "white", background: green[6]}} variant="solid" >
              Add
            </Button>,
            <Button style={{marginLeft: "2%"}} key="cancel" color="danger" variant="solid" onClick={() => setAddMemberModalVisible(false)} danger>
              Cancel
            </Button>,
          </div>
              </Form>

      </Modal>
    </div>
  );
};

export default ManageTeams;
