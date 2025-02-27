import React, { useState } from "react";
import { Layout, Card, Row, Col, Menu, Select, Tooltip } from "antd";
import { TeamOutlined, ProjectOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

const { Sider, Content } = Layout;
const { Option } = Select;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const allProjects = ["Project A", "Project B", "Project C"];

// Dữ liệu mẫu
const rawData = {
  stageData: [
    { name: "To Do", value: 15 },
    { name: "In Progress", value: 25 },
    { name: "Review", value: 10 },
    { name: "Done", value: 28 },
  ],
  projectData: [
    { name: "Project A", todo: 5, inProgress: 10, review: 3, done: 12 },
    { name: "Project B", todo: 7, inProgress: 8, review: 5, done: 10 },
    { name: "Project C", todo: 3, inProgress: 7, review: 2, done: 6 },
  ],
  performanceData: [
    { date: "2025-02-01", Bob: 5, Charlie: 7, David: 4 },
    { date: "2025-02-08", Bob: 8, Charlie: 10, David: 6 },
    { date: "2025-02-15", Bob: 12, Charlie: 14, David: 9 },
    { date: "2025-02-22", Bob: 15, Charlie: 18, David: 12 },
  ],
};

const TeamPerformance = () => {
  const [selectedTime, setSelectedTime] = useState("This Month");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Lọc dữ liệu theo bộ lọc cho từng biểu đồ
  const filterStageData = rawData.stageData.filter((task) => selectedStatus === "All" || task.name === selectedStatus);
  const filterProjectData = rawData.projectData.filter((project) => selectedProject === "All Projects" || project.name === selectedProject);

  const today = dayjs();
  const filterPerformanceData = rawData.performanceData.filter((entry) => {
    if (selectedTime === "This Week") return dayjs(entry.date).isAfter(today.subtract(7, "day"));
    if (selectedTime === "This Month") return dayjs(entry.date).isAfter(today.subtract(1, "month"));
    if (selectedTime === "This Quarter") return dayjs(entry.date).isAfter(today.subtract(3, "month"));
    return true;
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="light">
        <Menu mode="inline" defaultSelectedKeys={["team"]}>
          <Menu.Item key="team" icon={<TeamOutlined />}>Team Performance</Menu.Item>
          <Menu.Item key="projects" icon={<ProjectOutlined />}>Projects</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "24px" }}>
        <Content>
          {/* Biểu đồ số lượng công việc theo trạng thái */}
          <Card
            title="Task Distribution by Stage"
            extra={
              <Select value={selectedStatus} onChange={(value) => setSelectedStatus(value)} style={{ width: 150 }}>
                <Option value="All">All</Option>
                <Option value="To Do">To Do</Option>
                <Option value="In Progress">In Progress</Option>
                <Option value="Review">Review</Option>
                <Option value="Done">Done</Option>
              </Select>
            }
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={filterStageData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {filterStageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Biểu đồ số lượng công việc theo từng dự án */}
          <Card
            title="Tasks by Project"
            extra={
              <Select value={selectedProject} onChange={(value) => setSelectedProject(value)} style={{ width: 180 }}>
                <Option value="All Projects">All Projects</Option>
                {allProjects.map((project) => (
                  <Option key={project} value={project}>{project}</Option>
                ))}
              </Select>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filterProjectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="todo" stackId="a" fill="#8884d8" />
                <Bar dataKey="inProgress" stackId="a" fill="#82ca9d" />
                <Bar dataKey="review" stackId="a" fill="#ffc658" />
                <Bar dataKey="done" stackId="a" fill="#d84e4e" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Biểu đồ hiệu suất làm việc theo thời gian */}
          <Card
            title="Member Performance Over Time"
            extra={
              <Select value={selectedTime} onChange={(value) => setSelectedTime(value)} style={{ width: 150 }}>
                <Option value="This Week">This Week</Option>
                <Option value="This Month">This Month</Option>
                <Option value="This Quarter">This Quarter</Option>
              </Select>
            }
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={filterPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="Bob" fill="#0088FE" />
                <Bar dataKey="Charlie" fill="#00C49F" />
                <Bar dataKey="David" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TeamPerformance;
