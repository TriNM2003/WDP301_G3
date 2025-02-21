import { useState } from "react";
import {
  Table,
  Button,
  Dropdown,
  Menu,
  Popconfirm,
  Input,
  Space,
  Typography,
  Breadcrumb,
  Avatar,
  message
} from "antd";
import {
  UserOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  MoreOutlined,
  FileImageOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

// component
const ViewListProject = () => {

  // member data
  const [projects, setProjects] = useState([
    { key: "1", name: "SDN302", projectManager: "JohnSmith@gmail.com"},
    { key: "2", name: "WDP301", projectManager: "TriNM@gmail.com"},
  ]);

  // search state
  const [searchTerm, setSearchTerm] = useState("");
  // top pop up message
  const [messageApi, contexHolder] = message.useMessage();

  const showingMessage = (messageType, messageContent, messageDuration) => {
    messageApi.open({
      type: messageType,
      content: messageContent,
      duration: messageDuration
   })
  }


  const handleAddProject = () => {
    // navigate to add project page
    showingMessage("success", "clicked!", 1);
  }

  // filter by search
  const filteredProjects = projects.filter((project) => {
    // filter by search
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());    
    return matchesSearch;
  });



  // handle remove project
  const handleRemoveProject = (key) => {
    // update database
    
    // update fe state
    setProjects(projects.filter((member) => member.key !== key));
    showingMessage("success", "Project is moved to trashcan successfull", 2);
  };


  // table column configs
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <FileImageOutlined style={{fontSize: "1.6rem"}}/>{text}
        </Space>
      ),
        sorter: (a, b) => a.name.localeCompare(b.name),
      width: "40%"
    },
    { title: "Project Manager",
        dataIndex: "projectManager",
         key: "projectManager" ,
         render: (text) => (
          <Space>
            <Avatar icon={<UserOutlined />} style={{ fontSize: "16px" }} />
            {text}
          </Space>
        ),
        sorter: (a, b) => a.projectManager.localeCompare(b.projectManager),
        width: "40%"
    },
    {
      title: <div style={{textAlign: "center"}}><span>Action</span></div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu mode="vertical">
              <Menu.Item key="removeProject">
                <Popconfirm
                  title="Are you sure to remove this project?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleRemoveProject(record.key)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text">Remove</Button>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item key="projectSettings">
                <Button type="text" onClick={() => showingMessage("success", "project setting clicked", 1)}>Project settings</Button>
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

  // render fe
  return (
    <div style={{ padding: "40px", textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)"}}>
      {/* hien thi message api */}
      {contexHolder}

      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "20px" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>MySite</Breadcrumb.Item>
        <Breadcrumb.Item>View list projects</Breadcrumb.Item>
      </Breadcrumb>

      {/* title and button */}
      <div style={{ display: "flex", gap: "10px",  marginRight: "20px", justifyContent: "space-between" }}>
          <Title level={2}>Projects</Title>
          <Button type="primary" style={{marginTop: "35px"}} onClick={() => handleAddProject()}>Create project</Button>
      </div>

      <div style={{ display: "flex", marginBottom: "20px"}}>
        <div style={{ display: "flex", gap: "10px",  marginRight: "20px" }}>
          {/* search bar */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        </div>
      </div>


      {/* project table */}
      <Table 
      columns={columns} 
      dataSource={filteredProjects} 
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
      style={{
        width: "100%",
        borderRadius: "15px"
      }}
      />

    </div>
  );
};

export default ViewListProject;
