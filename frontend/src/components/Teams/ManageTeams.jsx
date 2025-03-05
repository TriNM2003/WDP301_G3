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

const { Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const ManageTeams = () => {
    const teamAvatarTemp = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSqYmVDup6h_eN1Gv2hl8aOecLnIEsJwkuHQ&s";
    const teamLeaderAvatarTemp = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuBznWbg4zGZWlvMx68yxtX3n41Y7Q7mnFCA&s";
    const createDateTemp = "04/07/2025";
    const updateDateTemp = "06/11/2025";
    const nav = useNavigate();
  // content
  const [members, setMembers] = useState([
    { key: "1", teamName: "Bear", teamLeader: "John@gmail.com", teamAvatar: teamAvatarTemp, teamLeaderAvatar: teamLeaderAvatarTemp, createDate: createDateTemp, updateDate: updateDateTemp },
    { key: "2", teamName: "Tiger", teamLeader: "Alice@gmail.com", teamAvatar: teamAvatarTemp, teamLeaderAvatar: teamLeaderAvatarTemp, createDate: createDateTemp, updateDate: updateDateTemp },
    { key: "3", teamName: "Terminator", teamLeader: "Alice1@gmail.com", teamAvatar: teamAvatarTemp, teamLeaderAvatar: teamLeaderAvatarTemp, createDate: createDateTemp, updateDate: updateDateTemp },
    { key: "4", teamName: "Ant Queen", teamLeader: "Alice2@gmail.com", teamAvatar: teamAvatarTemp, teamLeaderAvatar: teamLeaderAvatarTemp, createDate: createDateTemp, updateDate: updateDateTemp },
  ]);
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

  // dung de sort date string
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    console.log(new Date(year, month - 1, day))
    return new Date(year, month - 1, day);
  };

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
    messageApi.open({
      type: "success",
      content: "Add members successfully",
      duration: 2
    });
    console.log(selectedEmails);
  }

  // filter by name and role
  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.teamName.toLowerCase().includes(searchTerm.toLowerCase());
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
        sorter: (a, b) => parseDate(a.createDate) - parseDate(b.createDate),
        width: "20%"
    },
    { title: "Last updated",
        dataIndex: "updateDate",
         key: "updateDate" ,
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
                  onConfirm={() => handleRemoveMember(record.key)}
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
        <Button type="primary" icon={<TeamOutlined />} onClick={() => setAddMemberModalVisible(true)}>
          Add team
        </Button>
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


      <Modal
        title="Add team"
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
                              message: 'Please input team name!',
                          },
                      ]}
                  >
                      <Input />
                  </Form.Item>

                  <Form.Item
                      label="Team leader"
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

                  <Form.Item
                      name="teamAvatar"
                      label="Team avatar"
                      valuePropName="fileList"
                      //   getValueFromEvent={normFile}
                      extra="Select a picture to represent your team"
                  >
                      <Upload name="logo" action="/upload.do" listType="picture">
                          <Button icon={<UploadOutlined />}>Click to upload</Button>
                      </Upload>
                  </Form.Item>
  

                  {/* <Form.Item label={null}>
                      <Button type="primary" htmlType="submit">
                          Submit
                      </Button>
                  </Form.Item> */}
              </Form>

      </Modal>
    </div>
  );
};

export default ManageTeams;
