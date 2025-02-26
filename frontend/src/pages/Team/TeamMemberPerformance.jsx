import React from "react";
import { Layout, Menu, Card, Avatar, Typography, List, Row, Col, Button, Table, Tag } from "antd";
import { TeamOutlined, ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const teams = [
  {
    id: "1",
    teamName: "Frontend Devs",
    teamLeader: { id: "u1", name: "Alice Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
    teamMembers: [
      { id: "u2", name: "Bob Smith", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
      { id: "u3", name: "Charlie Brown", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    ],
    site: { id: "s1", name: "Site A" },
    createdAt: "2024-01-15T10:00:00Z",
  },
];

const selectedMember = {
  id: "u2",
  fullName: "Bob Smith",
  email: "bob@example.com",
  phoneNumber: "0123456789",
  userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
  teams: teams,
  projects: [
    { id: "p1", projectName: "Project Alpha", projectAvatar: "https://via.placeholder.com/40", projectStatus: "active" },
    { id: "p2", projectName: "Project Beta", projectAvatar: "https://via.placeholder.com/40", projectStatus: "archived" },
  ],
  activities: [
    { id: "a1", name: "Fix login bug", status: "completed", project: "Project Alpha", manager: "Alice Johnson", createdAt: "2024-02-15" },
    { id: "a2", name: "Implement dashboard", status: "doing", project: "Project Beta", manager: "David Brown", createdAt: "2024-02-18" },
    { id: "a3", name: "Optimize database", status: "overdue", project: "Project Gamma", manager: "Sarah Lee", createdAt: "2024-02-20" },
  ],
};

// Màu sắc trạng thái
const statusColors = {
  completed: "green",
  doing: "blue",
  overdue: "red",
};

const TeamMemberPerformance = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="light">
        <Menu mode="inline" defaultSelectedKeys={["team"]}>
          <Menu.Item key="team" icon={<TeamOutlined />}>Team</Menu.Item>
          <Menu.Item key="projects" icon={<ProjectOutlined />}>Projects</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "24px" }}>
        <Content>
          <Row gutter={[16, 16]}>
            <Col span={18}>
              {/* Top Status Bar */}
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card><CheckCircleOutlined style={{ color: "green" }} /> {selectedMember.activities.filter(a => a.status === "completed").length} Completed</Card>
                </Col>
                <Col span={8}>
                  <Card><ClockCircleOutlined /> {selectedMember.activities.filter(a => a.status === "doing").length} Ongoing</Card>
                </Col>
                <Col span={8}>
                  <Card><ExclamationCircleOutlined /> {selectedMember.activities.filter(a => a.status === "overdue").length} Overdue</Card>
                </Col>
              </Row>

              {/* Activity List */}
              <Card 
                title="Activity List" 
                style={{ marginTop: "16px" }} 
                extra={<Button type="primary" onClick={() => navigate('/activities')}>View all</Button>}
              >
                <Table dataSource={selectedMember.activities} rowKey="id" pagination={{ pageSize: 5 }}>
                  <Table.Column 
                    title="Activity Name" 
                    dataIndex="name" 
                    key="name" 
                    render={(text, record) => (
                      <Text strong style={{ cursor: "pointer", color: "#1890ff" }} onClick={() => navigate(`/activities/${record.id}`)}>
                        {text}
                      </Text>
                    )} 
                  />
                  <Table.Column title="Project Name" dataIndex="project" key="project" />
                  <Table.Column title="Project Manager" dataIndex="manager" key="manager" />
                  <Table.Column title="Ngày tạo" dataIndex="createdAt" key="createdAt" />
                  <Table.Column 
                    title="Status" 
                    dataIndex="status" 
                    key="status" 
                    render={(status) => <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>} 
                  />
                </Table>
              </Card>
            </Col>

            {/* Profile & Projects */}
            <Col span={6}>
              <Card title="Profile">
                <Avatar size={64} src={selectedMember.userAvatar} />
                <Title level={4}>{selectedMember.fullName}</Title>
                <Text>Email: {selectedMember.email}</Text>
                <br />
                <Text>Phone: {selectedMember.phoneNumber}</Text>
              </Card>

              {/* Ongoing Projects */}
              <Card title="Ongoing Projects" extra={<Button size="small" onClick={() => navigate('/projects')}>View all</Button>} style={{ marginTop: "16px" }}>
                <List
                  dataSource={selectedMember.projects}
                  renderItem={(project) => (
                    <List.Item 
                      style={{ cursor: "pointer" }} 
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      <Avatar src={project.projectAvatar} /> {project.projectName}
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeamMemberPerformance;
