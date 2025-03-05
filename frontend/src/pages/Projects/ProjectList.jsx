import React, { useState, useContext } from "react";
import { Card, Avatar, Badge, Button, List, Typography, Layout, Menu, Divider, Tooltip, Input, Empty, Dropdown } from "antd";
import { ArrowRightOutlined, RightOutlined, UnorderedListOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CreateProject from "../../components/Project/CreateProject";
import { AppContext } from "../../context/AppContext";



const { Text, Title } = Typography;
const { Sider, Content, Header } = Layout;






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

  const { projects, user } = useContext(AppContext);

  const filteredProjectsByUser = Array.isArray(projects)
    ? projects.filter((project) =>
      project.projectMember?.some(member => member._id?._id === user._id)
    )
    : [];



  // console.log("ProjectList huhu:", filteredProjectsByUser);

  const navigate = useNavigate();
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("created-newest"); // Mặc định lọc theo tên A-Z

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
  const sortedProjects = [...filteredProjectsByUser].sort((a, b) => {
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


  return (
    
      <Layout>
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
            <CreateProject visible={showCreateModal} onCreate={handleCreateProject} onCancel={() => setShowCreateModal(false)} />

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
                        {project?.projectName}
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
                            {project.projectMember
                              ?.filter(member => member.roles.includes("projectMember")) // Chỉ lấy những thành viên có role là "projectMember"
                              .map((member) => (
                                <Tooltip
                                  key={member._id?._id}
                                  title={member._id?.username || "Unknown User"} // Hiển thị username của thành viên
                                >
                                  <Avatar src={member._id?.userAvatar || "default-avatar.png"} /> {/* Hiển thị avatar hoặc avatar mặc định */}
                                </Tooltip>
                              ))}
                          </Avatar.Group>

                          {/* PM Avatar */}
                          {project.projectMember?.some(member => member.roles.includes("projectManager")) ? (
                            <Tooltip title={
                              project.projectMember.find(member => member.roles.includes("projectManager"))?._id?.username || "Unknown PM"
                            }>
                              <Avatar src={
                                project.projectMember.find(member => member.roles.includes("projectManager"))?._id?.userAvatar || "default-avatar.png"
                              } />
                            </Tooltip>
                          ) : (
                            <Text type="secondary">No PM Assigned</Text>
                          )}

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
                        onClick={() => navigate(`${project.projectSlug}`)}
                        lo
                        
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
    
  );
};

export default ProjectList;
