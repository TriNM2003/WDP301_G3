import React, { useState } from "react";
import { Card, Avatar, Badge, Button, List, Typography, Layout, Menu, Divider, Tooltip, Input, Empty, Dropdown } from "antd";
import { ArrowRightOutlined, RightOutlined, UnorderedListOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const { Text, Title } = Typography;
const { Sider, Content, Header } = Layout;

const currentUserId = "u1"; // Giả sử ID tài khoản hiện tại là "u1"

const projects = [
  {
    id: "1",
    projectName: "NJZ 1",
    projectAvatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2025-02-22T04:34:00Z" },
      { _id: "u2", name: "User2", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-18T08:30:00Z" },
      { _id: "u3", name: "User3", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-18T08:30:00Z" },
      { _id: "u4", name: "User4", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-18T08:30:00Z" },
      { _id: "u5", name: "User5", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-18T08:30:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },

    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "2",
    projectName: "NJZ 2",
    projectAvatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2025-02-22T04:34:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "3",
    projectName: "NJZ 3",
    projectAvatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-21T12:30:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "4",
    projectName: "NJZ 4",
    projectAvatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2021-01-15T10:00:00Z",
  },
  {
    id: "5",
    projectName: "NJZ 5",
    projectAvatar: "#52c41a",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2020-01-15T10:00:00Z",
  }
  ,
  {
    id: "6",
    projectName: "NJZ 5",
    projectAvatar: "#52c41a",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2019-01-15T10:00:00Z",
  }
  ,
  {
    id: "7",
    projectName: "NJZ 5",
    projectAvatar: "#52c41a",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2018-01-15T10:00:00Z",
  }
  ,
  {
    id: "8",
    projectName: "NJZ 5",
    projectAvatar: "#52c41a",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2017-01-15T10:00:00Z",
  }
  ,
  {
    id: "9",
    projectName: "NJZ 5",
    projectAvatar: "#52c41a",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2024-01-15T10:00:00Z",
  }
  ,
  {
    id: "10",
    projectName: "NJZ 5",
    projectAvatar: "#52c41a",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2024-01-15T10:00:00Z",
  }
  ,
  {
    id: "11",
    projectName: "NJZ 5",
    projectAvatar: "#52c41a",
    projectMember: [
      { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
    ],
    pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    createdAt: "2024-01-15T10:00:00Z",
  }

];


const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  const intervals = [
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];

  for (let interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

const ProjectList = () => {
  const navigate = useNavigate();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("name-asc"); // Mặc định lọc theo tên A-Z
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setSearchQuery(inputValue);
    setShowAllProjects(true);
    setCurrentPage(1);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleCreateProject = (values) => {
    console.log("New Project Data:", values);
    setShowCreateModal(false);
  };
  const sortedProjects = [...projects].sort((a, b) => {
    if (filter === "name-asc") return a.projectName.localeCompare(b.projectName);
    if (filter === "name-desc") return b.projectName.localeCompare(a.projectName);
    if (filter === "created-newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (filter === "created-oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (filter === "updated-newest") return new Date(b.projectMember[0].updatedAt) - new Date(a.projectMember[0].updatedAt);
    if (filter === "updated-oldest") return new Date(a.projectMember[0].updatedAt) - new Date(b.projectMember[0].updatedAt);
    return 0;
  });

  const filteredProjects = searchQuery
    ? sortedProjects.filter((project) =>
      project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : sortedProjects;

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const displayedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  // Hàm lấy thời gian tương đối

  // Tìm 4 project có thời gian cập nhật gần nhất của tài khoản hiện tại
  // const recentProjects = projects
  //   .filter(project => project.projectMember.some(member => member._id === currentUserId))
  //   .map(project => ({
  //     ...project,
  //     lastUpdated: project.projectMember.find(member => member._id === currentUserId)?.updatedAt || null
  //   }))
  //   .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)) // Sắp xếp theo thời gian cập nhật gần nhất
  //   .slice(0, 4);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="light">
        <Menu mode="inline" defaultSelectedKeys={["all"]}>
          <Menu.Item key="all" icon={<UnorderedListOutlined />}>Recent Projects</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        {/* <Header style={{ background: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "50px" }}>
          <Title level={3} style={{ margin: 0 }}>Projects</Title>
          <Button type="primary">Create Project</Button>
        </Header> */}
        <Content style={{ padding: "0px 20px", textAlign: "left" }}>



          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: "0 20px",
            marginTop: "20px",
            position: "relative"
          }}>

            <div style={{ width: "200px" }}></div>
            <div style={{
              display: "flex",
              alignItems: "center",
              background: "#ffffff",
              padding: "8px",
              borderRadius: "25px",
              width: "600px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)"
            }}>
              <Input
                placeholder="Search by project name..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  boxShadow: "none",
                  outline: "none",

                }}
              />
              <Dropdown
                overlay={
                  <Menu onClick={(e) => setFilter(e.key)}>
                    <Menu.Item key="name-asc">Name A-Z</Menu.Item>
                    <Menu.Item key="name-desc">Name Z-A</Menu.Item>
                    <Menu.Item key="created-newest">Newest Created</Menu.Item>
                    <Menu.Item key="created-oldest">Oldest Created</Menu.Item>
                    <Menu.Item key="updated-newest">Newest Updated</Menu.Item>
                    <Menu.Item key="updated-oldest">Oldest Updated</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Button
                  icon={<FilterOutlined />}
                  style={{
                    color: "#2f54eb",
                    border: "none",
                    background: "#f0f0f0",
                    borderRadius: "20px",
                    marginRight: "8px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#efdbff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                >
                  FILTER
                </Button>
              </Dropdown>

              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                style={{
                  borderRadius: "20px",
                  background: "#2f54eb",
                  border: "none",
                  color: "white",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#722ed1")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2f54eb")}
              >
                FIND
              </Button>
            </div>
            <Button
              type="primary"
              style={{
                backgroundColor: "#2f54eb",
                border: "none",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#722ed1")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2f54eb")}
              onClick={() => setShowCreateModal(true)}
            >
              Create Project
            </Button>

          </div>

          {filteredProjects.length === 0 ? (
            <Empty description="No projects found" style={{ marginTop: "20px" }} />
          ) : (
            <>
              {!searchQuery && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Title level={5} style={{ marginTop: "10px" }}>All Projects</Title>

                </div>
              )}

              <List
                grid={{ gutter: 48, column: 4 }}
                dataSource={displayedProjects}
                style={{ marginTop: searchQuery ? "20px" : "0px" }}
                renderItem={(project) => (
                  <List.Item>
                    <Card
                      className="project-card"
                      hoverable
                      cover={
                        <div
                          className="project-card-bg"
                          style={{
                            background: `url(${project.projectAvatar}) center/cover no-repeat`,
                            height: "150px",
                            width: "95%",
                            margin: "5px auto 0px",
                            borderRadius: "5px 5px 0 0",

                          }}
                        />
                      }
                      bodyStyle={{ padding: "7px" }}
                    >
                      <Title level={5} style={{ margin: "0", textAlign: "left" }}>
                        {project.projectName}
                      </Title>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "15px 0" }}>
                        {/* Text Label Team & PM */}
                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                          <Text type="secondary" style={{ fontSize: "12px" }}>Members</Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>Manager</Text>
                        </div>

                        {/* Wrapper chứa màu nền, bao bọc cả hai avatar */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#F5F5F5",
                            padding: "1px 0px",
                            borderRadius: "25px",
                            width: "100%",
                            marginTop: "4px"
                          }}
                        >
                          {/* Team Avatars */}
                          <Avatar.Group maxCount={3}>
                            {project.projectMember.map((member) => (
                              <Tooltip key={member._id} title={member.name}>
                                <Avatar src={member.avatar} />
                              </Tooltip>
                            ))}
                          </Avatar.Group>

                          {/* PM Avatar */}
                          <Tooltip title={project.pm.name}>
                            <Avatar src={project.pm.avatar} />
                          </Tooltip>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingTop: "7px" }}>
                        <Text type="secondary">Project Created</Text>
                        <Text type="secondary">{formatDate(project.createdAt)}</Text>
                      </div>


                      <Button
                        type="link"
                        style={{
                          marginTop: "10px",
                          padding: "5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          backgroundColor: "#f0f5ff",

                        }}
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        Go to project{" "}
                        <RightOutlined style={{ fontSize: "14px", position: "relative", top: "2px" }} />
                      </Button>



                    </Card>
                  </List.Item>
                )}
              />
              {totalPages > 1 && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      type={currentPage === i + 1 ? "primary" : "default"}
                      style={{ margin: "0 5px" }}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>

              )}
            </>
          )}

        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectList;
