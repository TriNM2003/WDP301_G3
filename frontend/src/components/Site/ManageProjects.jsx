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
  message,
  Image
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
const ManageProjects = () => {

  // member data
  const [projects, setProjects] = useState([
    { key: "1", name: "SDN302", projectAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7MmifjwAGhgzOBMwJrZQqlhOBPc24RjG9w&s", projectManager: "JohnSmith@gmail.com", projectManagerAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1", createAt: "11/02/2004", updateAt: "13/02/2024"},
    { key: "2", name: "WDP301", projectAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7MmifjwAGhgzOBMwJrZQqlhOBPc24RjG9w&s", projectManager: "TriNM@gmail.com", projectManagerAvatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", createAt: "10/02/2004", updateAt: "15/02/2024"},
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

  // dung de sort date string
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    console.log(new Date(year, month - 1, day))
    return new Date(year, month - 1, day);
  };


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
  const handleRemoveProject = (key, name) => {
    // update database
    
    // update fe state
    setProjects(projects.filter((member) => member.key !== key));
    showingMessage("success", `Project ${name} moved to trashcan successfull`, 2);
  };


  // table column configs
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Image src={record.projectAvatar} style={{width: '3vw', height: '3vw'}}/>{text}
        </Space>
      ),
        sorter: (a, b) => a.name.localeCompare(b.name),
      width: "30%"
    },
    { title: "Project Manager",
        dataIndex: "projectManager",
         key: "projectManager" ,
         render: (text, record) => (
          <Space>
            <Avatar src={record.projectManagerAvatar} style={{ fontSize: "16px" }} />
            {text}
          </Space>
        ),
        sorter: (a, b) => a.projectManager.localeCompare(b.projectManager),
        width: "30%"
    },
    { title: "Created date",
      dataIndex: "createAt",
       key: "createAt" ,
      sorter: (a, b) => parseDate(a.createAt) - parseDate(b.createAt),
      width: "15%"
    },
    { title: "Last updated",
      dataIndex: "updateAt",
       key: "updateAt" ,
      sorter: (a, b) => parseDate(a.updateAt) - parseDate(b.updateAt),
      width: "15%"
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
                  onConfirm={() => handleRemoveProject(record.key, record.name)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text">Remove</Button>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item key="projectSettings">
                <Button type="text" onClick={() => showingMessage("success", `project ${record.name} setting clicked`, 1)}>Project settings</Button>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      )
      ,
      width: "10%"
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
        borderRadius: "5%"
      }}
      />

    </div>
  );
};

export default ManageProjects;
