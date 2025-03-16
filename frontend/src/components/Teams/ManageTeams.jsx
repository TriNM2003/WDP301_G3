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
import { gold, gray, green } from "@ant-design/colors";
import { useLocation, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import { AppContext } from "../../context/AppContext";
import CreateTeam from "./CreateTeam";

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const ManageTeams = () => {
    const {teams, setTeams} = useContext(AppContext);
    const teamAvatarTemp = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSqYmVDup6h_eN1Gv2hl8aOecLnIEsJwkuHQ&s";
    const teamLeaderAvatarTemp = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuBznWbg4zGZWlvMx68yxtX3n41Y7Q7mnFCA&s";
    const createDateTemp = "04/07/2025";
    const updateDateTemp = "06/11/2025";
    const nav = useNavigate();
  // content

  const tableData =  teams.map(function(team, index){
    const teamLeader = team.teamMembers.find(member => member.roles.includes("teamLeader"));
    return {
      key: index+1,
      teamName: team?.teamName,
      teamLeader: teamLeader?._id.email,
      teamAvatar: team?.teamAvatar,
      teamLeaderAvatar: teamLeader?._id.userAvatar,
      createDate: team?.createAt || "Not found",
      updateDate: team?.updateAt || "Not found"
    }
  })
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

  useEffect(function(){
    console.log(tableData)
  }, [teams])

  // dung de sort date string
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    console.log(new Date(year, month - 1, day))
    return new Date(year, month - 1, day);
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
          {text}
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
         render: (text) => new Date(text).toLocaleDateString("vi-VN"),
        sorter: (a, b) => parseDate(a.createDate) - parseDate(b.createDate),
        width: "20%"
    },
    { title: "Last updated",
        dataIndex: "updateDate",
         key: "updateDate" ,
         render: (text) => new Date(text).toLocaleDateString("vi-VN"),
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
                  // onConfirm={() => handleRemoveMember(record.key)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button icon={<DeleteOutlined />} danger type="text">Remove team</Button>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item key="kick">
                <Button icon={<EditOutlined />}  type="text" onClick={() => nav("/site/team/manage-member")}>Manage team members</Button>
              </Menu.Item>
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
