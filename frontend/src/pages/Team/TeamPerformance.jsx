import React, { useState } from "react";
import { Layout, Card, Avatar, Typography, Row, Col, Menu, Progress, Table, List, Tooltip, Input } from "antd";
import { TeamOutlined, ProjectOutlined, SearchOutlined } from "@ant-design/icons";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const TeamPerformance = () => {
  // Dữ liệu mẫu (Sẽ kết nối API sau)
  const teamPerformance = {
    totalProjects: 8, // Tổng số dự án
    totalActivities: 60, // Tổng số công việc
    inProgressActivities: 25, // Công việc đang làm
    completedActivities: 28, // Công việc đã hoàn thành
    overdueActivities: 7, // Công việc quá hạn
  };
  const team = {
    teamName: "Frontend Dev Team",
    teamLeader: "Alice Johnson",
    teamMembers: [
      { _id: "1", name: "Bob Smith", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
      { _id: "2", name: "Charlie Brown", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
      { _id: "3", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
      { _id: "4", name: "Emma Watson", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
      { _id: "5", name: "John Doe", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
      { _id: "6", name: "Jane Smith", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
      { _id: "7", name: "Chris Evans", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
      { _id: "8", name: "Natalie Portman", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
    ],
  };

  const [searchTerm, setSearchTerm] = useState("");

  // Lọc danh sách thành viên theo tìm kiếm
  const filteredMembers = team.teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider width={200} theme="light">
        <Menu mode="inline" defaultSelectedKeys={["team"]}>
          <Menu.Item key="team" icon={<TeamOutlined />}>Team Performance</Menu.Item>
          <Menu.Item key="projects" icon={<ProjectOutlined />}>Projects</Menu.Item>
        </Menu>
      </Sider>

      {/* Content */}
      <Layout style={{ padding: "24px" }}>
        <Content>
          <Row gutter={[16, 16]}>
            {/* Cột 1 (Chiếm 3/4 màn hình - span 18) */}
            <Col span={18}>
              {/* Hàng trên - 4 ô thống kê */}
              <Row gutter={[16, 16]}>
                {/* Tổng số Project */}
                <Col span={6}>
                  <Card bordered>
                    <Title level={5}>Total Projects</Title>
                    <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{teamPerformance.totalProjects}</Text>
                  </Card>
                </Col>

                {/* Số lượng Activity đang làm / Tổng Activity */}
                <Col span={6}>
                  <Card bordered>
                    <Title level={5}>In Progress</Title>
                    <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}>
                      {teamPerformance.inProgressActivities} / {teamPerformance.totalActivities}
                    </Text>
                  </Card>
                </Col>

                {/* Số lượng Activity đã hoàn thành */}
                <Col span={6}>
                  <Card bordered>
                    <Title level={5}>Completed</Title>
                    <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#52c41a" }}>
                      {teamPerformance.completedActivities}
                    </Text>
                  </Card>
                </Col>

                {/* Số lượng Activity quá hạn */}
                <Col span={6}>
                  <Card bordered>
                    <Title level={5}>Overdue</Title>
                    <Text style={{ fontSize: "24px", fontWeight: "bold", color: "#ff4d4f" }}>
                      {teamPerformance.overdueActivities}
                    </Text>
                  </Card>
                </Col>
              </Row>

              {/* Hàng dưới - Bảng phân công công việc */}
              <Card title="Task Assignment by Member" style={{ marginTop: "20px" }}>
                <Table
                  columns={[
                    { title: "Member", dataIndex: "name", key: "name" },
                    { title: "Tasks Assigned", dataIndex: "tasks", key: "tasks" },
                    { title: "Tasks Completed", dataIndex: "completed", key: "completed" },
                    {
                      title: "Completion Rate",
                      key: "completionRate",
                      render: (_, record) => (
                        <Progress percent={((record.completed / record.tasks) * 100).toFixed(2)} />
                      ),
                    },
                  ]}
                  dataSource={[
                    { key: "1", name: "Bob Smith", tasks: 15, completed: 10 },
                    { key: "2", name: "Charlie Brown", tasks: 20, completed: 18 },
                    { key: "3", name: "David White", tasks: 15, completed: 7 },
                  ]}
                  pagination={false}
                />
              </Card>
            </Col>

            {/* Cột 2 - Team Info & Members (Giữ nguyên) */}
            <Col span={6}>
              {/* Hàng trên - Thông tin cơ bản của Team */}
              <Card title="Team Information" style={{ marginBottom: "16px", height: "150px" }}>
                <Text strong>Team Name:</Text> <Text>{team.teamName}</Text> <br />
                <Text strong>Team Leader:</Text> <Text>{team.teamLeader}</Text>
              </Card>

              {/* Hàng dưới - Danh sách thành viên (Ẩn thanh cuộn) */}
              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Members ({team.teamMembers.length})</span>
                    <Input
                      placeholder="Search member..."
                      allowClear
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: "50%" }}
                    />
                  </div>
                }
                style={{ height: "calc(100% - 170px)" }}
              >
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    paddingRight: "5px",
                    scrollbarWidth: "none", /* Firefox */
                    msOverflowStyle: "none", /* IE, Edge */
                  }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredMembers}
                    renderItem={(member) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Tooltip title={member.name}>
                              <Avatar src={member.avatar} />
                            </Tooltip>
                          }
                          title={member.name}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeamPerformance;
